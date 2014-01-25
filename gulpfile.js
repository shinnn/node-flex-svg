'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
  return gulp.src(['./*.js'])
    .pipe(jshint({
      camelcase: true,
      trailing: true,
      indent: 2,
      browser: false,
      node: true
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

gulp.task('default', ['lint', 'test']);
