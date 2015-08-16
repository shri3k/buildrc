# buildscript
Usually installed globally, this package accepts a seperate file which has JSON object just like your `package.json` file and then merges it to your `scripts` object inside `package.json` file.

The main idea here is for you to have your runnable scripts in an external file instead of jamming everything inside `package.json`  
Think of this as a your barebone build tool if you don't want to install `gulp` or `grunt`.

## Quick Demo
<iframe src="http://showterm.io/e820ca3ff0aeabea1640e" width="640" height="480"></iframe>

## Installation
```js
npm install -g buildscript #install it as cli
```

```js
npm install buildscript #install it as lib
```
## Requirements
- [ ] Should have `package.json` file on your current working directory
- [ ] Should have `.buildscript <default> {JSON}` file on your current working directory as well
- [ ] Should have `buildscript` installed globally (if using it as cli)

## Usage
### cli
```bash
echo '{"start":"node index.js", "lint":"eslint ./"}' >> .buildscript;
buildscript
```
or

```bash
echo '{"start":"node index.js", "lint":"eslint ./"}' >> .myscript;
buildscript .myscript
```
### lib
```js
var buildscript = require('buildscript');
buildscript('./.buildscript').then(function(){
  //do your thing here
});
```
