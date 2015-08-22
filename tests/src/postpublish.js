var test = require('./beforeAfterEach').test;
var exec = require('child_process').exec;
var chdir = require('./setPath');

function cleanup(task) {
  exec('npm uninstall buildrc -g', (err) => {
    if (err) {
      process.stderr.write(err.toString());
      process.exit(1);
    }
    task();
  });
}

function success(t) {
  return () => {
    t.pass('Everything looks okay!!');
    t.end();
  };
}

function fail(t) {
  return () => {
    t.fail('Something went wrong!!');
    t.end();
  };
}
test('run the post publish sanity check', (t) => {
  chdir();
  exec('npm install buildrc -g', (err) => {
    if (err) {
      process.stderr.write(err.toString());
      cleanup(fail(t));
    }
    exec('build', (err) => {
      if (err) {
        process.stderr.write(err.toString());
        cleanup(fail(t));
        process.exit(1);
      }
      cleanup(success(t));
    });
  });
});

