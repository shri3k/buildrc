/**
 * lib/index.js
 *
 * Opens the external file and package.json file
 * Does all kinds of check to validate both files simulateously
 * Merges data from external file to package.json's script object
 */
var fs = require('fs');
var log = require('winston');

/**
 * Description: Callback of @getData
 *
 * @method  readDat
 * @param  {Function} resolve function
 * @param  {Function} reject function
 * @param  {String} name of the path
 * @return  {Function}
 */
function readDat(resolve, reject, key) {
  return function(err, data) {
    if (err) {
      process.stderr.write(err.toString());
      process.exit(1);
    }
    resolve({
      data: data,
      key: key
    });
  };
}

/**
 * Description: Simply passes the async data to a promise
 *
 * @method getData
 * @param  {String} pathname of the file to be read
 * @return {Object} Promise object
 */
function getData(path) {
  return new Promise(function(resolve, reject) {
    log.debug('Dir of', path, process.cwd());
    fs.readFile(path, {
      encoding: 'utf-8'
    }, readDat(resolve, reject, path)); //passing path to be reused as key in memoize
  });
}

function isObject(dat) {
  return (dat != null && typeof dat === 'object');
}

function parse(dat) {
  var result;
  try {
    result = JSON.parse(dat);
  } catch (e) {
    process.stderr.write(e);
    process.exit(1);
  }
  return result;
}

function memoize(fn) {
  var cache = {};
  return function(key, val) {
    var result;
    if (key in cache) {
      result = cache[key];
    } else {
      result = fn.call(this, val);
      cache[key] = result;
    }
    return result;
  };
}

function promise2(obj, val) {
  return function(resolve, reject) {
    getData(obj.pkg)
      .then(function(val2) {
        if (isObject(obj.memParse(val2.key2, val2.data))) {
          resolve({
            src: obj.memParse(val.key, val.data),
            pkg: obj.memParse(val2.key, val2.data)
          });
        } else {
          reject(`Invalid object in ${obj.pkg}`);
        }
      });
  };
}

/**
 * Description: Finally write the content of external file
 *              to the package.json
 *
 * @method writeToPkgJson
 * @param  {Object}
 * @return  N/A
 */
function writeToPkgJson(obj, resolve) {
  return function(val3) {
    for (var k in val3.src) {
      val3.pkg.scripts[k] = val3.src[k];
    }
    fs.writeFile(obj.pkg, JSON.stringify(val3.pkg, null, 2), function(err) {
      if (err) {
        throw err;
      }
      resolve();
    });
  };
}

function init(src, pkg) {
  var obj = {
    src: src || './.buildrc',
    pkg: pkg || './package.json',
    memParse: memoize(parse)
  };
  return new Promise(function(resolve, reject) {
    getData(obj.src)
      .then(function(val) {
        if (isObject(obj.memParse(val.key, val.data))) {
          return new Promise(promise2(obj, val));
        }
      })
      .then(writeToPkgJson(obj, resolve))
      .catch(function(err) {
        process.stderr.write(err.toString());
      });
  });
}

module.exports = init;
