'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var mergeStream = require('merge-stream');
var stylish = require('jshint-stylish');

gulp.task('lint', function() {
  gulp.src(['{,src/,test/}*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
  gulp.src(['package.json'])
    .pipe($.jsonlint())
    .pipe($.jshint.reporter());
});

gulp.task('clean', del.bind(null, ['{lib,tmp}']));

gulp.task('transpile', ['clean'], function() {
  return mergeStream(
    gulp.src(['src/*.js'])
      .pipe($.es6Transpiler())
      .pipe(gulp.dest('lib')),
    gulp.src(['test/*.js'])
      .pipe($.es6Transpiler({
        globals: {
          describe: false,
          it: false
        }
      }))
      .pipe($.espower())
      .pipe(gulp.dest('tmp'))
  );
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
    .pipe($.mocha({reporter: 'spec'}));
});

gulp.task('default', ['test', 'watch']);
