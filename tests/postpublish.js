'use strict';

var test = require('./beforeAfterEach').test;
var exec = require('child_process').exec;
var chdir = require('./setPath');

function cleanup(task) {
  exec('npm uninstall buildrc -g', function (err) {
    if (err) {
      process.stderr.write(err.toString());
      process.exit(1);
    }
    task();
  });
}

function success(t) {
  return function () {
    t.pass('Everything looks okay!!');
    t.end();
  };
}

function fail(t) {
  return function () {
    t.fail('Something went wrong!!');
    t.end();
  };
}
test('run the post publish sanity check', function (t) {
  chdir();
  exec('npm install buildrc -g', function (err) {
    if (err) {
      process.stderr.write(err.toString());
      cleanup(fail(t));
    }
    exec('build', function (err) {
      if (err) {
        process.stderr.write(err.toString());
        cleanup(fail(t));
        process.exit(1);
      }
      cleanup(success(t));
    });
  });
});