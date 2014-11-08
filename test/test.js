'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;

var flexSvg = require('../');
var rimraf = require('rimraf');
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
  '<svg></svg>'
].join('\n');

test('flexSvg()', function(t) {
  t.plan(7);

  flexSvg(fixture, function(err, result) {
    t.equal(
      result, expected,
      'should remove width and height attributes from SVG.'
    );
    t.error(err, 'should not pass any errors when it removes attributes successfully');
  });

  flexSvg(fixtureNoAttr, function(err, result) {
    t.equal(
      result, expectedNoAttr,
      'should return SVG string even if the input SVG doesn\'t have any attributes'
    );
    t.error(err, 'should not pass any errors even if the input SVG doesn\'t have any attributes');
  });

  flexSvg('<svg><</svg>', function(err) {
    t.equal(
      err.message, 'Unencoded <\nLine: 0\nColumn: 7\nChar: <',
      'should pass an error when input string is invalid SVG.'
    );
  });

  flexSvg('<p/>\n', function(err) {
    t.equal(
      err.message, 'Input doesn\'t SVG.',
      'should pass an error when input string is not SVG.'
    );
  });

  flexSvg('', function(err) {
    t.equal(
      err.message, 'Input doesn\'t SVG.',
      'should pass an error when it takes an empty string.'
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

  cmd(['--input', 'test/fixture.svg', '--output', 'test/tmp_foo/svg'])
  .on('close', function() {
    fs.readFile('test/tmp_foo/svg', function(err, buf) {
      t.error(err, 'should output a file using --output flag.');
      t.equal(
        buf.toString(), expected,
        'should use a file as a source, using --input flag.'
      );
      rimraf.sync('test/tmp_foo');
    });
  });

  cmd(['-i', 'test/fixture.svg', '-o', 'test/tmp_bar/svg'])
  .on('close', function() {
    fs.readFile('test/tmp_bar/svg', function(err, buf) {
      t.error(err, 'should use -o as an alias of --output.');
      t.equal(
        buf.toString(), expected,
        'should use -i as an alias of --input.'
      );
      rimraf.sync('test/tmp_bar');
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
      'should print an  error it cannot parse the string.'
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
      'should print an  error it cannot read the file.'
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
      'should print an  error it cannot write the file.'
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
