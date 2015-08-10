/**
 *
 */
'use strict';

var path = require('path');
var childProcess = require('child_process');
var exec = childProcess.exec;
var fs = require('fs');
var test = require('tape');
var lib = require('../../lib/');

var cfgFile = '.buildscript';
var buildScript;

var beforeEach = function beforeEach(test, beforeEachStep) {
  return function(name, cbFromAfterEach) {
    console.log('beforeEach closure');
    test(name, function(t) {
      var _end = t.end;
      t.end = function() {
        t.end = _end;
        cbFromAfterEach(t);
      };
      beforeEachStep(t);
    });
  };
};

var afterEach = function afterEach(test, afterEachStep) {
  return function(name, spec) {
    console.log('afterEach closure');
    test(name, function(t) {
      var _end = t.end;
      t.end = function() {
        t.end = _end;
        afterEachStep(t);
      };
      spec(t);
    });
  };
};
test = beforeEach(test, function(t) {
  console.log('beforeEach');
  buildScript = {
    'test': 'node test',
    'start': 'npm start'
  };
  setRightPath();
  fs.writeFileSync('./' + cfgFile, JSON.stringify(buildScript));
  exec('npm init -y', function(err) {
    if (err) {
      process.stderr.write(err.toString());
      process.exit(1);
    }
    t.end();
  });
});

test = afterEach(test, function(t) {
  console.log('afterEach');
  setRightPath();
  fs.unlinkSync(cfgFile);
  fs.unlinkSync('package.json');
  t.end();
});

//TODO: write a fail test that opens and checks for the object
//TODO: write a test that executes cmd
function setRightPath() {
  process.chdir(path.resolve(__dirname));
}

test('matches the script object in buildscript with package.json', function(t) {
  lib(path.resolve(__dirname, './' + cfgFile), path.resolve(__dirname, './package.json')).then((function(t) {
    return function() {
      setRightPath();
      var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
      t.deepEqual(pkgFile.scripts, buildScript, 'script object should be equal');
      t.end();
    };
  })(t));
});

test('does not match the script object on package.json', function(t) {
  var buildScript2 = {
    'random': 'this is random',
    'blah': 'hey'
  };
  lib(path.resolve(__dirname, './' + cfgFile), path.resolve(__dirname, './package.json')).then((function(t) {
    return function() {
      setRightPath();
      var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
      t.notDeepEqual(pkgFile.scripts, buildScript2, 'script should not be equal');
      t.end();
    };
  })(t));
});

test('executes as cli with matching object', function(t) {
  setRightPath();
  exec('../../bin/cli', function(err) {
    if (err) {
      process.stderr.write(err);
      process.exit(1);
    }
    var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
    t.deepEqual(pkgFile.scripts, buildScript, 'script from global exec object should be equal');
    t.end();
  });
});

test('executes as cli with unmatching object', function(t) {
  var buildScript2 = {
    'random': 'this is random',
    'blah': 'hey'
  };
  setRightPath();
  exec('../../bin/cli', function(err) {
    if (err) {
      process.stderr.write(err);
      process.exit(1);
    }
    var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
    t.notDeepEqual(pkgFile.scripts, buildScript2, 'script from global exec object should be equal');
    t.end();
  });
});
