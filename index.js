'use strict';

const {Parser, Builder} = require('xml2js');

function FlexSvg(options) {
	if (!(this instanceof FlexSvg)) {
		return new FlexSvg(options);
	}

	const parser = new Parser(options);
	const builder = new Builder(options);

	this.parser = parser;
	this.builder = builder;

	return function flexSvg(data, cb) {
		if (typeof cb !== 'function') {
			throw new TypeError(`${cb} is not a function. The last argument to flex-svg must be a function.`);
		}

		parser.parseString(data, (err, result) => {
			if (err) {
				cb(err);
				return;
			}

			if (!result || result.svg === undefined) {
				cb(new Error('Input isn\'t SVG.'));
				return;
			}

			const attributes = result.svg.$;
			if (attributes) {
				delete attributes.width;
				delete attributes.height;
			}

			cb(null, builder.buildObject(result));
		});
	};
}

module.exports = function flexSvg(data, options, cb) {
	if (!cb) {
		cb = options;
		options = {};
	}

	new FlexSvg(options)(data, cb);
};

module.exports.FlexSvg = FlexSvg;
