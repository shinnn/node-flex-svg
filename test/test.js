'use strict';

var fs = require('fs');
var assert = require('assert');
var flexSvg = require('../flex-svg.js');

describe('Converted SVG', function() {
  it('should have flexible with and height.', function(done) {
    fs.readFile('test/fixture/rect.svg', function(err, data) {
      if (err) throw err;
      flexSvg('' + data, function(err, svgStr) {
        if (err) throw err;
        var expected =
          '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
          '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 400 100" enable-background="new 0 0 400 100" xml:space="preserve">\n' +
          '  <rect width="400px" height="100px" style="fill:rgb(0,0,255);"/>\n' +
          '</svg>';
        assert.strictEqual(svgStr, expected);
        done();
      });
    });
  });
});
