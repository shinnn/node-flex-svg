// flex-svg.js
// Copyright (c) 2014 Shinnosuke Watanabe
// Licensed uder the MIT license

'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var gulpRelease = require('gulp-release');

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

gulp.task('release', function(){
  return gulp.src('package.json')
    .pipe(gulpRelease({
      commit: {
        message: 'release: <%= package.version %>'
      },
      tag: {
        name: '<%= package.version %>'
      },
      push: {
        upstream: 'master'
      },
      publish: true
    }));
});

gulp.task('default', ['lint']);