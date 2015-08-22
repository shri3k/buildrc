/**
 * The code of beforeEach and afterEach were taken from raynos
 * here:- https://github.com/substack/tape/issues/59#issuecomment-32808769
 */
'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var test = require('tape');
var setRightPath = require('./setPath');
var cfgFile = '.buildrc';

var buildrc = {
  'test': 'node test',
  'start': 'npm start'
};

var beforeEach = function beforeEach(test, beforeEachStep) {
  return function (name, cbFromAfterEach) {
    test(name, function (t) {
      var _end = t.end;
      t.end = function () {
        t.end = _end;
        cbFromAfterEach(t);
      };
      beforeEachStep(t);
    });
  };
};

var afterEach = function afterEach(test, afterEachStep) {
  return function (name, spec) {
    test(name, function (t) {
      var _end = t.end;
      t.end = function () {
        t.end = _end;
        afterEachStep(t);
      };
      spec(t);
    });
  };
};

test = beforeEach(test, function (t) {
  setRightPath();
  fs.writeFileSync('./' + cfgFile, JSON.stringify(buildrc));
  exec('npm init -y', function (err) {
    if (err) {
      process.stderr.write(err.toString());
      process.exit(1);
    }
    t.end();
  });
});

test = afterEach(test, function (t) {
  setRightPath();
  fs.unlinkSync(cfgFile);
  fs.unlinkSync('package.json');
  t.end();
});

exports.test = test;
exports.buildrc = buildrc;