# flex-svg

[![Build Status](https://travis-ci.org/shinnn/node-flex-svg.svg?branch=master)](https://travis-ci.org/shinnn/node-flex-svg)
[![Build status](https://ci.appveyor.com/api/projects/status/9q6scamtv2b5q9cw?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/node-flex-svg)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/node-flex-svg.svg)](https://coveralls.io/r/shinnn/node-flex-svg)
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

[![NPM version](https://badge.fury.io/js/flex-svg.svg)](https://www.npmjs.org/package/flex-svg)

[Use npm.](https://www.npmjs.org/doc/cli/npm-install.html)

```
npm install flex-svg
```

## API

### flexSvg(*SVGdata* [, *options*], *callback*)

*SVGdata*: `String` of SVG or `Buffer` of SVG file  
*options*: `Object` (directly passed to the [xml2js.Parser](https://github.com/Leonidas-from-XIV/node-xml2js#options) options and the [xml2js.Builder](https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class) options)  
*callback*: `Function`

#### callback(*error*, *result*)

*error*: `Error` if it fails to parse SVG, otherwise `null`  
*result*: `String` of SVG without `width` and `height` attributes

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

### flexSvg.FlexSvg([*options*])

Return: `Function`

Create a function to which options are binded. This is more efficient way in the case when the program repeatedly runs [`flexSvg`](#flexsvgsvgdata--options-callback) function with the same options.

## CLI

You can use this module as a CLI tool by installing it [globally](https://www.npmjs.org/doc/files/npm-folders.html#global-installation).

```
npm install -g flex-svg
```

### Usage

```
Usage1: flex-svg <SVG string>
Usage2: cat <SVG file> | flex-svg

Options:
  -i, --input    Input SVG file instead of SVG string.
  -o, --output   Output file (STDOUT by default)      
  -h, --help     Display usage information            
  -v, --version  Display version number
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE)
