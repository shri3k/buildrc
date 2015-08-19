# buildrc | [![Build Status](https://travis-ci.org/sinkingshriek/buildrc.svg)](https://travis-ci.org/sinkingshriek/buildrc)
Usually installed globally, this package accepts a seperate file which has JSON object just like your `package.json` file and then merges it to your `scripts` object inside `package.json` file.

The main idea here is for you to have your runnable scripts in an external file instead of jamming everything inside `package.json`  
Think of this as a your barebone build tool if you don't want to install `gulp` or `grunt`.

## Quick Demo
http://showterm.io/787a91558d7dd1f8cbe52

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
build
```
or

```bash
echo '{"start":"node index.js", "lint":"eslint ./"}' >> .myscript;
build .myscript
```
### lib
```js
var build = require('buildrc');
build('./.buildrc').then(function(){
  //do your thing here
});
```

##License
Copyright (c) 2015, sinkingshriek

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
