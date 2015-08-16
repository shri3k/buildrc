# buildrc | [![Build Status](https://travis-ci.org/sinkingshriek/buildrc.svg?branch=master)](https://travis-ci.org/sinkingshriek/buildrc)
Usually installed globally, this package accepts a seperate file which has JSON object just like your `package.json` file and then merges it to your `scripts` object inside `package.json` file.

The main idea here is for you to have your runnable scripts in an external file instead of jamming everything inside `package.json`  
Think of this as a your barebone build tool if you don't want to install `gulp` or `grunt`.

## Quick Demo
http://showterm.io/e820ca3ff0aeabea1640e

## Installation
```js
npm install -g buildrc #install it as cli
```

```js
npm install buildrc #install it as lib
```
## Requirements
- [ ] Should have `package.json` file on your current working directory
- [ ] Should have `.buildrc <default> {JSON}` file on your current working directory as well
- [ ] Should have `buildrc` installed globally (if using it as cli)

## Usage
### cli
```bash
echo '{"start":"node index.js", "lint":"eslint ./"}' >> .buildrc;
buildrc
```
or

```bash
echo '{"start":"node index.js", "lint":"eslint ./"}' >> .myscript;
buildrc .myscript
```
### lib
```js
var buildrc = require('buildrc');
buildrc('./.buildrc').then(function(){
  //do your thing here
});
```
