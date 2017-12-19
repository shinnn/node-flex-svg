'use strict';

const {Parser, Builder} = require('xml2js');

class FlexSvg {
	constructor(options) {
		const parser = new Parser(options);
		const builder = new Builder(options);

		return function flexSvg(data, cb) {
			if (typeof cb !== 'function') {
				throw new TypeError(`Expected the last argument to flex-svg to be a function, but got ${
					cb
				}.`);
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
}

module.exports = function flexSvg(data, options, cb) {
	if (!cb) {
		cb = options;
		options = {};
	}

	new FlexSvg(options)(data, cb);
};

module.exports.FlexSvg = FlexSvg;
