/* eslint new-cap:0 */
'use strict';

const flexSvg = require('.');
const test = require('tape');

const fixture = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1px" height="2px">
</svg>`;

const fixtureNoAttr = '<?xml version="1.0" encoding="utf-8"?><svg></svg>';

const expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"/>`;

const expectedNoAttr = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg/>`;

test('flexSvg()', t => {
	t.plan(8);

	flexSvg(fixture, (...args) => {
		t.deepEqual(
			args,
			[null, expected],
			'should remove width and height attributes from SVG.'
		);
	});

	flexSvg(fixtureNoAttr, null, (...args) => {
		t.deepEqual(
			args,
			[null, expectedNoAttr],
			'should return SVG string even if the input SVG doesn\'t have any attributes'
		);
	});

	flexSvg(fixture, {
		ignoreAttrs: true,
		xmldec: {encoding: 'base64'}
	}, (...args) => {
		t.deepEqual(
			args,
			[null, '<?xml version="1.0" encoding="base64"?>\n<svg>\n</svg>'],
			'should support parser options and builder options.'
		);
	});

	flexSvg('<svg><</svg>', err => {
		t.equal(
			err.message,
			'Unencoded <\nLine: 0\nColumn: 7\nChar: <',
			'should pass an error when input string is invalid SVG.'
		);
	});

	flexSvg('<p/>\n', err => {
		t.equal(
			err.message,
			'Input isn\'t SVG.',
			'should pass an error when input string is not SVG.'
		);
	});

	flexSvg('', err => {
		t.equal(
			err.message,
			'Input isn\'t SVG.',
			'should pass an error when it takes an empty string.'
		);
	});

	flexSvg(null, err => {
		t.equal(
			err.message,
			'Cannot read property \'toString\' of null',
			'should pass an error when the first argument doesn\'t have .toString() method.'
		);
	});

	t.throws(
		() => flexSvg(fixture, true),
		/TypeError.*Expected the last argument to flex-svg to be a function, but got true\./,
		'should throw a error when the last argument is not a function.'
	);
});

test('flexSvg.FlexSvg()', t => {
	t.plan(1);

	new flexSvg.FlexSvg({
		ignoreAttrs: true,
		xmldec: {encoding: 'base64'}
	})(fixture, (err, result) => {
		t.deepEqual(
			[err, result],
			[null, '<?xml version="1.0" encoding="base64"?>\n<svg>\n</svg>'],
			'should support parser options and builder options.'
		);
	});
});
