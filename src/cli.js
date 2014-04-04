// flex-svg
// Copyright (c) 2014 Shinnosuke Watanabe
// Licensed uder the MIT license

'use strict';

var fs = require('fs');
var yargs = require('yargs');
var argv = yargs
  .usage('Usage: flex-svg [input.svg] [options]')
  .alias({
    'h': 'help',
    'o': 'output',
    's': 'string'
  })
  .describe({
    'h': 'Display usage information.',
    'o': 'Output file (STDOUT by default).',
    's': 'Input SVG string instead of file.'
  })
  .argv;

function outputFlexSvg(data) {
  let flexSvg = require('./flex-svg');
  flexSvg(data, (parseErr, result) => {
    if (parseErr) {
      throw `SVG parse error: ${ parseErr }`;
    }
    if (argv.output) {
      fs.writeFileSync(argv.output, result);
    } else {
      console.log(result);
    }
  });
}

var filename = argv._[0];

if ((!filename && !argv.string) || argv.help) {
  yargs.showHelp();
  process.exit();
}

if (argv.string) {
  outputFlexSvg(argv.string);
} else {
  fs.readFile(filename, (readErr, data) => {
    if (readErr) {
      if (readErr.code === 'ENOENT') {
        console.error(`Source file "${ filename }" not found.`);
        process.exit(1);
      }
      throw readErr;
    }
    outputFlexSvg(data);
  });
}
