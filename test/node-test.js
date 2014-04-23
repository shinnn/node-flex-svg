/* jshint quotmark: false */

'use strict';

var fs = require('fs');
var Q = require('q');
var flexSvg = require('../lib/flex-svg.js');
var assert = require('power-assert');

var readFile = Q.denodeify(fs.readFile);
var promiseFlexSvg = Q.denodeify(flexSvg);

function flexSvgFile(path) {
  return readFile(path)
    .then(res => promiseFlexSvg(res));
}

describe('flex-svg', () => {
  it('should remove width and height attributes from SVG.', () => {
    return Q.all([
      flexSvgFile('test/fixtures/width_and_height.svg'),
      readFile('test/expected/width_and_height.svg')
    ]).spread((actual, expected) => {
      assert.strictEqual(actual, expected.toString());
    });
  });

  it("should return SVG string even if the input SVG doesn't have any attributes", () => {
    return Q.all([
      flexSvgFile('test/fixtures/no_attr.svg'),
      readFile('test/expected/no_attr.svg')
    ]).spread((actual, expected) => {
      assert.strictEqual(actual, expected.toString());
    });
  });
  
  it('should throw an error when input string is not XML.', () => {
    assert.throws(() => {
      flexSvg("I'm not XML.", () => {});
    });
  });

  it('should throw an error when input string is not SVG but XML.', () => {
    assert.throws(() => {
      flexSvg("<html></html>", () => {});
    });
  });
});
