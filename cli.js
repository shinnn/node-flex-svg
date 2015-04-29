#!/usr/bin/env node
'use strict';

var outputFileSync = require('output-file-sync');
var yargs = require('yargs');

var pkg = require('./package.json');
var argv = yargs
  .usage([
    pkg.description,
    '',
    'Usage1: flex-svg <SVG string>',
    'Usage2: cat <SVG file> | flex-svg'
  ].join('\n'))
  .version(pkg.version, 'version')
  .alias({
    i: 'input',
    o: 'output',
    h: 'help',
    v: 'version'
  })
  .string(['_', 'i', 'o'])
  .describe({
    i: 'Input SVG file instead of SVG string.',
    o: 'Output file (STDOUT by default)',
    h: 'Display usage information',
    v: 'Display version number'
  })
  .argv;

function run(data) {
  var flexSvg = require('./');

  flexSvg(data, function(err, result) {
    if (err) {
      throw err;
    }

    if (argv.output) {
      outputFileSync(argv.output, result);
    } else {
      console.log(result);
    }
  });
}

if (process.stdin.isTTY) {
  if (argv._.length === 0 && argv.input === undefined || argv.help !== undefined) {
    yargs.showHelp('log');
  } else if (argv.input) {
    var fs = require('fs');
    run(fs.readFileSync(argv.input, 'utf8').replace(/^\ufeff/g, ''));
  } else {
    run(argv._[0]);
  }
} else {
  require('get-stdin')(run);
}
