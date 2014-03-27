// flex-svg.js
// Copyright (c) 2014 Shinnosuke Watanabe
// Licensed uder the MIT license

'use strict';

var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();
xml2js = undefined;

module.exports = function flexSvg(data, callback) {
  parser.parseString(data, function (err, result) {
    var attributes = result.svg.$;
    if (attributes) {
      delete attributes.width;
      delete attributes.height;
    }
    
    callback(err, builder.buildObject(result));
  });
};
