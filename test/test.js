/*eslint new-cap:0 */
'use strict';

var spawn = require('child_process').spawn;

var flexSvg = require('..');
var readRemoveFile = require('read-remove-file');
var test = require('tape');

var pkg = require('../package.json');

var fixture = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1px" height="2px">',
  '</svg>;'
].join('\n');

var fixtureNoAttr = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<svg></svg>;'
].join('\n');

var expected = [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"/>'
].join('\n');

var expectedNoAttr = [
  '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
  '<svg/>'
].join('\n');

test('flexSvg()', function(t) {
  t.plan(9);

  t.equal(flexSvg.name, 'flexSvg', 'should have a function name.');

  flexSvg(fixture, function(err, result) {
    t.deepEqual(
      [err, result],
      [null, expected],
      'should remove width and height attributes from SVG.'
    );
  });

  flexSvg(fixtureNoAttr, null, function(err, result) {
    t.deepEqual(
      [err, result],
      [null, expectedNoAttr],
      'should return SVG string even if the input SVG doesn\'t have any attributes'
    );
  });

  flexSvg(fixture, {
    ignoreAttrs: true,
    xmldec: {encoding: 'base64'}
  }, function(err, result) {
    t.deepEqual(
      [err, result],
      [null, '<?xml version="1.0" encoding="base64"?>\n<svg>\n</svg>'],
      'should support parser options and builder options.'
    );
  });

  flexSvg('<svg><</svg>', function(err) {
    t.equal(
      err.message,
      'Unencoded <\nLine: 0\nColumn: 7\nChar: <',
      'should pass an error when input string is invalid SVG.'
    );
  });

  flexSvg('<p/>\n', function(err) {
    t.equal(
      err.message,
      'Input doesn\'t SVG.',
      'should pass an error when input string is not SVG.'
    );
  });

  flexSvg('', function(err) {
    t.equal(
      err.message,
      'Input doesn\'t SVG.',
      'should pass an error when it takes an empty string.'
    );
  });

  t.throws(
    flexSvg.bind(null, fixture, true),
    /TypeError.*true is not a function.*must be a function/,
    'should throw a type error when the last argument is not a function.'
  );

  t.throws(
    flexSvg.bind(null, null, t.fail),
    /TypeError.*toString/,
    'should throw a type error when the first argument doesn\'t have .toString() method.'
  );
});

test('flexSvg.FlexSvg()', function(t) {
  t.plan(3);

  var FlexSvg = flexSvg.FlexSvg;

  t.equal(FlexSvg.name, 'FlexSvg', 'should have a function name.');

  new FlexSvg({
    ignoreAttrs: true,
    xmldec: {encoding: 'base64'}
  })(fixture, function(err, result) {
    t.deepEqual(
      [err, result],
      [null, '<?xml version="1.0" encoding="base64"?>\n<svg>\n</svg>'],
      'should support parser options and builder options.'
    );
  });

  FlexSvg()(fixture, function(err, result) {
    t.deepEqual(
      [err, result],
      [null, expected],
      'should create an tnstance when it is called without `new`..'
    );
  });
});

test('"flex-svg" command inside a TTY context', function(t) {
  t.plan(15);

  var cmd = function(args) {
    var cp = spawn('node', [pkg.bin].concat(args), {
      stdio: [process.stdin, null, null]
    });
    cp.stdout.setEncoding('utf8');
    cp.stderr.setEncoding('utf8');
    return cp;
  };

  cmd([fixture]).stdout.on('data', function(output) {
    t.equal(output, expected + '\n', 'should print SVG string.');
  });

  cmd(['--input', 'test/fixture.svg', '--output', 'tmp.svg']).on('close', function() {
    readRemoveFile('tmp.svg', 'utf8', function(err, content) {
      t.strictEqual(err, null, 'should output a file using --output flag.');
      t.equal(content, expected, 'should use a file as a source, using --input flag.');
    });
  });

  cmd(['-i', 'test/fixture.svg', '-o', 'tmp/tmp.svg']).on('close', function() {
    readRemoveFile('tmp/tmp.svg', 'utf8', function(err, content) {
      t.strictEqual(err, null, 'should use -o as an alias of --output.');
      t.equal(content, expected, 'should use -i as an alias of --input.');
    });
  });

  cmd(['--help']).stdout.on('data', function(output) {
    t.ok(/Usage/.test(output), 'should print usage information using --help flag.');
  });

  cmd(['-h']).stdout.on('data', function(output) {
    t.ok(/Usage/.test(output), 'should use -h as an alias of --help.');
  });

  cmd(['--version']).stdout.on('data', function(output) {
    t.equal(output, pkg.version + '\n', 'should print version number using --version flag.');
  });

  cmd(['-v']).stdout.on('data', function(output) {
    t.equal(output, pkg.version + '\n', 'should use -v as an alias of --version.');
  });

  var parseErr = '';
  cmd(['<svg foo=1></svg>'])
  .on('close', function(code) {
    t.notEqual(code, 0, 'should fail when it cannot parse the string.');
    t.ok(
      /Unquoted attribute value/.test(parseErr),
      'should print an error message when it cannot parse the string.'
    );
  })
  .stderr.on('data', function(output) {
    parseErr += output;
  });

  var inputErr = '';
  cmd(['--input', '____foo_____bar____baz____qux____'])
  .on('close', function(code) {
    t.notEqual(code, 0, 'should fail when it cannot read the file.');
    t.ok(
      /ENOENT/.test(inputErr),
      'should print an error message when it cannot read the file.'
    );
  })
  .stderr.on('data', function(output) {
    inputErr += output;
  });

  var outputErr = '';
  cmd([fixture, '--output', 'node_modules'])
  .on('close', function(code) {
    t.notEqual(code, 0, 'should fail when it cannot write the file.');
    t.ok(
      /EISDIR/.test(outputErr),
      'should print an error message when it cannot write the file.'
    );
  })
  .stderr.on('data', function(output) {
    outputErr += output;
  });
});

test('"flex-svg" command outside a TTY context', function(t) {
  t.plan(1);

  var cp = spawn('node', [pkg.bin], {
    stdio: ['pipe', null, null]
  });
  cp.stdout.on('data', function(data) {
    t.equal(data.toString(), expected + '\n', 'should print SVG string.');
  });
  cp.stdin.end(fixture);
});
