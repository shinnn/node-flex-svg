// flex-svg.js
// Copyright (c) 2014 Shinnosuke Watanabe
// Licensed uder the MIT license

'use strict';

var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var builder = new xml2js.Builder();

module.exports = function flexSvg(svgString, callback) {
  parseString(svgString, function (err, result) {
    delete result.svg.$.width;
    delete result.svg.$.height;
    
    callback(err, builder.buildObject(result));
  });
};
