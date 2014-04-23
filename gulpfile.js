'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var merge = require('event-stream').merge;
var stylish = require('jshint-stylish');

// mocha
var GLOBALS = {
  describe: false,
  it: false,
  specify: false,
  before: false,
  beforeEach: false,
  after: false,
  afterEach: false
};

gulp.task('lint', function() {
  gulp.src(['{,src/,test/}*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
  gulp.src(['package.json'])
    .pipe($.jsonlint())
    .pipe($.jshint.reporter());
});

gulp.task('transpile', function(cb) {
  gulp.src(['{lib,tmp}/*'], {read: false})
    .pipe($.rimraf())
    .on('finish', function() {
      merge(
        gulp.src(['src/*.js'])
          .pipe($.es6Transpiler())
          .pipe(gulp.dest('lib')),
        gulp.src(['test/*.js'])
          .pipe($.es6Transpiler({globals: GLOBALS}))
          .pipe($.espower())
          .pipe(gulp.dest('tmp'))
      ).on('end', cb);
    });
});

gulp.task('watch', function() {
  gulp.watch([
    '{src,test}/*.js',
    'package.json',
    '.jshintrc'
  ], ['test']);
  gulp.watch(['gulpfile.js'], ['lint']);
});

gulp.task('test', ['lint', 'transpile'], function() {
  gulp.src(['tmp/*.js'])
    .pipe($.mocha({reporter: 'nyan'}));
});

gulp.task('default', ['test', 'watch']);
