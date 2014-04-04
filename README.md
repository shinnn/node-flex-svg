# flex-svg

[![NPM version](https://badge.fury.io/js/flex-svg.svg)](http://badge.fury.io/js/flex-svg)
[![Build Status](https://travis-ci.org/shinnn/node-flex-svg.svg?branch=master)](https://travis-ci.org/shinnn/node-flex-svg)
[![Dependency Status](https://david-dm.org/shinnn/node-flex-svg.svg)](https://david-dm.org/shinnn/node-flex-svg)
[![devDependency Status](https://david-dm.org/shinnn/node-flex-svg/dev-status.svg)](https://david-dm.org/shinnn/node-flex-svg#info=devDependencies)

A [Node](http://nodejs.org/) module for creating SVG files of flexible width and height

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px">
  <rect width="50px" height="50px"/>
</svg>
```

↓

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <rect width="50px" height="50px"/>
</svg>
```

If `width` and `height` attributes of outermost svg elements are not specified, they are regarded as `100%` according to [*SVG 1.1 Specification*](http://www.w3.org/TR/SVG11/struct.html#SVGElementWidthAttribute).

## Used by

* [grunt-flex-svg](https://github.com/shinnn/grunt-flex-svg) ([Grunt](http://gruntjs.com/) plugin)
* [gulp-flex-svg](https://github.com/shinnn/gulp-flex-svg) ([gulp](http://gulpjs.com/) plugin)

## Installation

Install with [npm](https://www.npmjs.org/). (Make sure you have installed [Node](http://nodejs.org/).)

```
npm install --save flex-svg
```

## Usage

### flexSvg(SVGdata, callback)

SVGdata: `String` of SVG or `Buffer` of SVG file  
callback: `Function`

The callback function takes two arguments. The first is XML parse error, and the second is SVG string without `width` and `height` attributes.

## Example

```javascript
var fs = require('fs');
var flexSvg = require('flex-svg');

fs.readFile('path/to/svg', function(readErr, data) {
  if (readErr) throw readErr;
  flexSvg(data, function(parseErr, result) {
    if (parseErr) throw parseErr;
    console.log(result);
  });
});
```

## CLI

You can use this module as a CLI tool by installing it globally.

```
npm install -g flex-svg
```

### Usage

```
Usage: flex-svg [input.svg] [options]

Options:
  -h, --help    Display usage information.       
  -o, --output  Output file (STDOUT by default). 
  -s, --string  Input SVG string instead of file.
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT license](./LICENSE)