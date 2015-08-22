'use strict';

var path = require('path');
var childProcess = require('child_process');
var exec = childProcess.exec;
var fs = require('fs');
var lib = require('../lib/');

var tape = require('./beforeAfterEach');
var setRightPath = require('./setPath');

var test = tape.test;

var cfgFile = '.buildrc';
var buildrc = tape.buildrc;

test('matches the script object in buildscript with package.json', function(t) {
  lib(path.resolve(__dirname, './' + cfgFile), path.resolve(__dirname, './package.json')).then((function(t) {
    return function() {
      setRightPath();
      var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
      t.deepEqual(pkgFile.scripts, buildrc, 'script object should be equal');
      t.end();
    };
  })(t));
});

test('does not match the script object on package.json', function(t) {
  var buildrc2 = {
    'random': 'this is random',
    'blah': 'hey'
  };
  lib(path.resolve(__dirname, './' + cfgFile), path.resolve(__dirname, './package.json')).then((function(t) {
    return function() {
      setRightPath();
      var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
      t.notDeepEqual(pkgFile.scripts, buildrc2, 'script should not be equal');
      t.end();
    };
  })(t));
});

test('executes as cli with matching object', function(t) {
  setRightPath();
  exec('../bin/cli', function(err) {
    if (err) {
      process.stderr.write(err);
      process.exit(1);
    }
    var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
    t.deepEqual(pkgFile.scripts, buildrc, 'script from global exec object should be equal');
    t.end();
  });
});

test('executes as cli with unmatching object', function(t) {
  var buildrc2 = {
    'random': 'this is random',
    'blah': 'hey'
  };
  setRightPath();
  exec('../bin/cli', function(err) {
    if (err) {
      process.stderr.write(err);
      process.exit(1);
    }
    var pkgFile = JSON.parse(fs.readFileSync('./package.json'));
    t.notDeepEqual(pkgFile.scripts, buildrc2, 'script from global exec object should be equal');
    t.end();
  });
});

