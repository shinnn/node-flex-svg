# flex-svg

[![npm version](https://img.shields.io/npm/v/flex-svg.svg)](https://www.npmjs.com/package/flex-svg)
[![Build Status](https://travis-ci.com/shinnn/node-flex-svg.svg?branch=master)](https://travis-ci.com/shinnn/node-flex-svg)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/node-flex-svg.svg)](https://coveralls.io/github/shinnn/node-flex-svg)

A [Node.js](https://nodejs.org/) module to create [SVG](https://www.w3.org/TR/SVG2/) files of flexible width and height

```xml
<?xml version="2.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px">
  <rect width="50px" height="50px"/>
</svg>
```

↓

```xml
<?xml version="2.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg">
  <rect width="50px" height="50px"/>
</svg>
```

If `width` and `height` attributes of outermost svg elements are not specified, they are regarded as `100%` according to the [SVG 2 Specification](https://www.w3.org/TR/SVG2/geometry.html#Sizing).

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install flex-svg
```

## API

```javascript
const flexSvg = require('flex-svg');
```

### flexSvg(*svgData* [, *options*], *callback*)

*svgData*: `string` `Buffer` (SVG)  
*options*: `Object` (directly passed to the [xml2js.Parser](https://github.com/Leonidas-from-XIV/node-xml2js#options) options and the [xml2js.Builder](https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class) options)  
*callback*: `Function`

#### callback(*error*, *result*)

*error*: `Error` if it fails to parse SVG, otherwise `null`  
*result*: `string` of SVG without `width` and `height` attributes

```javascript
const {readFile} = require('fs');
const flexSvg = require('flex-svg');

readFile('path/to/file.svg', (readErr, data) => {
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

### class flexSvg.FlexSvg([*options*])

Return: `Function`

Create a `Function` to which options are bound. This is more efficient way in the case when the program repeatedly runs [`flexSvg`](#flexsvgsvgdata--options-callback) function with the same options.

## License

[ISC License](./LICENSE) © 2017 - 2018 Shinnosuke Watanabe
