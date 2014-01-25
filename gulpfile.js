'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['{.,test}/*.js'])
    .pipe(jshint({
      camelcase: true,
      trailing: true,
      indent: 2,
      globalstrict: true,
      browser: false,
      node: true,
      // mocha
      globals: {
        describe: false,
        it: false,
        specify: false,
        before: false,
        beforeEach: false,
        after: false,
        afterEach: false
      }
    }))
    .pipe(jshint.reporter(stylish));
});

gulp.task('test', function() {
  return gulp.src(['./test/test.js'])
    .pipe(mocha({
      reporter: 'spec'
    }))
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  gulp.watch('{.,test}/*.js', ['lint', 'test']);
});

gulp.task('default', ['lint', 'test', 'watch']);
