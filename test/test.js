'use strict';

var fs = require('fs');
var assert = require('assert');
var Q = require('q');
var flexSvg = require('../flex-svg.js');

var readFile = Q.denodeify(fs.readFile);
var promiseFlexSvg = Q.denodeify(flexSvg);
var flexSvgFile = function(path) {
  return readFile(path).then(function(res) {
    return promiseFlexSvg(res);
  });
};

describe('flex-svg', function() {
  it('should remove width and height attributes from SVG.', function() {
    return Q.all([
      flexSvgFile('test/fixture/width_and_height.svg'),
      readFile('test/expected/width_and_height.svg')
    ]).spread(function(actual, expected) {
      assert.strictEqual(actual, expected.toString());
    });
  });

  it("should return SVG string even if the input SVG doesn't have width and height attributes", function() {
    return Q.all([
      flexSvgFile('test/fixture/no_attr.svg'),
      readFile('test/expected/no_attr.svg')
    ]).spread(function(actual, expected) {
      assert.strictEqual(actual, expected.toString());
    });
  });
  
  it('should throw an error when input string is not XML.', function() {
    assert.throws(function() {
      flexSvg("I'm not XML.", function() {});
    });
  });

  it('should throw an error when input string is not SVG but XML.', function() {
    assert.throws(function() {
      flexSvg("<html></html>", function() {});
    });
  });
});
