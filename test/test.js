'use strict';

var fs = require('fs');
var assert = require('assert');
var flexSvg = require('../flex-svg.js');

describe('flex-svg', function() {
  it('should remove width and height from SVG.', function(done) {
    var expected =
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
      '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 400 100" enable-background="new 0 0 400 100" xml:space="preserve">\n' +
      '  <rect width="400px" height="100px"/>\n' +
      '</svg>';
    
    fs.readFile('test/fixture/rect.svg', function(readErr, data) {
      if (readErr) done(readErr);
      flexSvg(data, function(parseErr, svgStr) {
        if (parseErr) done(parseErr);
        assert.strictEqual(svgStr, expected);
        done();
      });
    });
  });
});
