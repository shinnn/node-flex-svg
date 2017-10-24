# flex-svg

[![npm version](https://img.shields.io/npm/v/flex-svg.svg)](https://www.npmjs.com/package/flex-svg)
[![Build Status](https://travis-ci.org/shinnn/node-flex-svg.svg?branch=master)](https://travis-ci.org/shinnn/node-flex-svg)
[![Build status](https://ci.appveyor.com/api/projects/status/9q6scamtv2b5q9cw?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/node-flex-svg)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/node-flex-svg.svg)](https://coveralls.io/r/shinnn/node-flex-svg)

A [Node.js](https://nodejs.org/) module to create SVG files of flexible width and height

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

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install flex-svg
```

## API

```javascript
const flexSvg = require('flex-svg');
```

### flexSvg(*SVGdata* [, *options*], *callback*)

*SVGdata*: `string` `Buffer` (SVG)  
*options*: `Object` (directly passed to the [xml2js.Parser](https://github.com/Leonidas-from-XIV/node-xml2js#options) options and the [xml2js.Builder](https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class) options)  
*callback*: `Function`

#### callback(*error*, *result*)

*error*: `Error` if it fails to parse SVG, otherwise `null`  
*result*: `String` of SVG without `width` and `height` attributes

```javascript
const fs = require('fs');
const flexSvg = require('flex-svg');

fs.readFile('path/to/file.svg', (readErr, data) => {
  if (readErr) {
    throw readErr;
  }

  flexSvg(data, (parseErr, result) => {
    if (parseErr) {
      throw parseErr;
    }

    console.log(result);
  });
});
```

### flexSvg.FlexSvg([*options*])

Return: `Function`

Create a function to which options are binded. This is more efficient way in the case when the program repeatedly runs [`flexSvg`](#flexsvgsvgdata--options-callback) function with the same options.

## License

Copyright (c) 2014 - 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE)
