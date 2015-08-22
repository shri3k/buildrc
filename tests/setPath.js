'use strict';

var path = require('path');
module.exports = function setRightPath(cwd) {
  var _dir = cwd || __dirname;
  process.chdir(path.resolve(_dir));
};