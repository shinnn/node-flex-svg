#!/usr/bin/env node
'use strict';

const outputFileSync = require('output-file-sync');
const yargs = require('yargs');

const pkg = require('./package.json');
const argv = yargs
.usage([
  pkg.description,
  '',
  'Usage1: flex-svg <SVG string>',
  'Usage2: cat <SVG file> | flex-svg'
].join('\n'))
.alias({
  i: 'input',
  o: 'output',
  h: 'help',
  v: 'version'
})
.string(['_', 'i', 'o'])
.describe({
  input: 'Input SVG file instead of SVG string.',
  output: 'Output file (STDOUT by default)'
})
.argv;

function run(data) {
  const flexSvg = require('./');

  flexSvg(data, (err, result) => {
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
  if (argv._.length === 0 && argv.input === undefined || argv.help) {
    yargs.showHelp('log');
  } else if (argv.input) {
    const fs = require('fs');
    run(fs.readFileSync(argv.input, 'utf8').replace(/^\ufeff/g, ''));
  } else {
    run(argv._[0]);
  }
} else {
  require('get-stdin')().then(run);
}
