'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var es6transpiler = require('gulp-es6-transpiler');

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
  return gulp.src(['{,src/,test/}*.js'])
    .pipe(jshint({
      camelcase: true,
      trailing: true,
      indent: 2,
      globalstrict: true,
      browser: false,
      node: true,
      esnext: true,
      globals: GLOBALS
    }))
    .pipe(jshint.reporter(stylish));
});

gulp.task('transpile', function(cb) {
  gulp.src(['src/*.js'])
    .pipe(es6transpiler())
    .pipe(gulp.dest('lib'));
  gulp.src(['test/*.js'])
    .pipe(es6transpiler({globals: GLOBALS}))
    .pipe(gulp.dest('tmp'));
  cb();
});


gulp.task('watch', function() {
  gulp.watch(['{,src/,test/}*.js'], ['test']);
});

gulp.task('test', ['lint', 'transpile'], function() {
  gulp.src(['tmp/*.js'])
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['test', 'watch']);
