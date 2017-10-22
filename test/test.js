/* eslint new-cap:0 */
'use strict';

const spawn = require('child_process').spawn;

const flexSvg = require('..');
const readRemoveFile = require('read-remove-file');
const test = require('tape');

const pkg = require('../package.json');

const fixture = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1px" height="2px">
</svg>`;

const fixtureNoAttr = '<?xml version="1.0" encoding="utf-8"?><svg></svg>';

const expected = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"/>`;

const expectedNoAttr = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><svg/>`;

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
      'Input doesn\'t SVG.',
      'should pass an error when input string is not SVG.'
    );
  });

  flexSvg('', err => {
    t.equal(
      err.message,
      'Input doesn\'t SVG.',
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
    /TypeError.*true is not a function.*must be a function/,
    'should throw a error when the last argument is not a function.'
  );
});

test('flexSvg.FlexSvg()', t => {
  t.plan(2);

  const FlexSvg = flexSvg.FlexSvg;

  new FlexSvg({
    ignoreAttrs: true,
    xmldec: {encoding: 'base64'}
  })(fixture, (err, result) => {
    t.deepEqual(
      [err, result],
      [null, '<?xml version="1.0" encoding="base64"?>\n<svg>\n</svg>'],
      'should support parser options and builder options.'
    );
  });

  FlexSvg()(fixture, (err, result) => {
    t.deepEqual(
      [err, result],
      [null, expected],
      'should create an tnstance when it is called without `new`..'
    );
  });
});

test('"flex-svg" command inside a TTY context', t => {
  t.plan(13);

  function cmd(args) {
    const cp = spawn('node', [pkg.bin].concat(args), {
      stdio: [process.stdin, null, null]
    });
    cp.stdout.setEncoding('utf8');
    cp.stderr.setEncoding('utf8');
    return cp;
  }

  cmd([fixture]).stdout.on('data', output => {
    t.equal(output, expected + '\n', 'should print SVG string.');
  });

  cmd(['--input', 'test/fixture.svg', '--output', 'tmp.svg']).on('close', () => {
    readRemoveFile('tmp.svg', 'utf8').then(content => {
      t.equal(content, expected, 'should use a file as a source, using --input flag.');
    });
  });

  cmd(['-i', 'test/fixture.svg', '-o', 'tmp/tmp.svg']).on('close', () => {
    readRemoveFile('tmp/tmp.svg', 'utf8').then(content => {
      t.equal(content, expected, 'should use -i as an alias of --input.');
    });
  });

  cmd(['--help']).stdout.on('data', output => {
    t.ok(/Usage/.test(output), 'should print usage information using --help flag.');
  });

  cmd(['-h']).stdout.on('data', output => {
    t.ok(/Usage/.test(output), 'should use -h as an alias of --help.');
  });

  cmd(['--version']).stdout.on('data', output => {
    t.equal(output, pkg.version + '\n', 'should print version number using --version flag.');
  });

  cmd(['-v']).stdout.on('data', output => {
    t.equal(output, pkg.version + '\n', 'should use -v as an alias of --version.');
  });

  let parseErr = '';
  cmd(['<svg foo=1></svg>'])
  .on('close', code => {
    t.notEqual(code, 0, 'should fail when it cannot parse the string.');
    t.ok(
      /Unquoted attribute value/.test(parseErr),
      'should print an error message when it cannot parse the string.'
    );
  })
  .stderr.on('data', output => {
    parseErr += output;
  });

  let inputErr = '';
  cmd(['--input', '____foo_____bar____baz____qux____'])
  .on('close', code => {
    t.notEqual(code, 0, 'should fail when it cannot read the file.');
    t.ok(
      /ENOENT/.test(inputErr),
      'should print an error message when it cannot read the file.'
    );
  })
  .stderr.on('data', output => {
    inputErr += output;
  });

  let outputErr = '';
  cmd([fixture, '--output', 'node_modules'])
  .on('close', code => {
    t.notEqual(code, 0, 'should fail when it cannot write the file.');
    t.ok(
      /EISDIR/.test(outputErr),
      'should print an error message when it cannot write the file.'
    );
  })
  .stderr.on('data', output => {
    outputErr += output;
  });
});

test('"flex-svg" command outside a TTY context', t => {
  t.plan(1);

  const cp = spawn('node', [pkg.bin], {
    stdio: ['pipe', null, null]
  });
  cp.stdout.on('data', data => {
    t.equal(data.toString(), expected + '\n', 'should print SVG string.');
  });
  cp.stdin.end(fixture);
});
