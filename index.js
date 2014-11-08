// flex-svg
// Copyright (c) 2014 Shinnosuke Watanabe
// Licensed uder the MIT license

'use strict';

var xml2js = require('xml2js');
var builder = new xml2js.Builder();

module.exports = function flexSvg(data, cb) {
  xml2js.parseString(data, function(err, result) {
    if (err) {
      cb(err);
      return;
    }

    if (!result || result.svg === undefined) {
      cb(new Error('Input doesn\'t SVG.'));
      return;
    }

    var attributes = result.svg.$;
    if (attributes) {
      delete attributes.width;
      delete attributes.height;
    }

    cb(null, builder.buildObject(result));
  });
};
