# node-flex-svg

[![NPM version](https://badge.fury.io/js/flex-svg.png)](http://badge.fury.io/js/flex-svg)
[![Build Status](https://travis-ci.org/shinnn/node-flex-svg.png?branch=master)](https://travis-ci.org/shinnn/node-flex-svg)
[![Dependency Status](https://david-dm.org/shinnn/node-flex-svg.png)](https://david-dm.org/shinnn/node-flex-svg)
[![devDependency Status](https://david-dm.org/shinnn/node-flex-svg/dev-status.png)](https://david-dm.org/shinnn/node-flex-svg#info=devDependencies)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/shinnn/node-flex-svg/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

Makes SVG files of flexible width and height

## Installation

Install via [npm](https://npmjs.org/).

```
npm i --save flex-svg
```

Make sure you have installed [Node](http://nodejs.org/) before running this command.

## Usage

### flexSvg( SVGdata, callback )

SVGdata: `String` of SVG or `Buffer` of SVG file  
callback: `Function`

The callback function takes two arguments. The first is XML parse error, and the second is SVG string without `width` and `height` attributes.

## Example

### Original SVG file

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px">
  <rect width="50px" height="50px"></rect>
</svg>
```

### Script

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

### Output

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <rect width="50px" height="50px"/>
</svg>
```

## License

Copyright (c) 2014 [Shinnosuke Watanabe](https://github.com/shinnn) All rights reserved.

Licensed under [the MIT license](./LICENSE).