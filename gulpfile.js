'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var watch = require('gulp-watch');
var replc = require('./replc');

var cfg = {
  testFiles: [
    'lib/**/*.spec.js',
    '*.spec.js'
  ]
};

gulp.task('default', ['jsh']);
gulp.task('jsh', function() {
  setTimeout(function() {
    replc({
      context: {
        expect: require('chai').expect
      }
    })
  });
});

gulp.task('watch', function() {
  watch(cfg.testFiles, ['mocha']);
});
gulp.task('mocha', function () {
  return gulp.src(cfg.testFiles, {read: false}).
      pipe(mocha({reporter: 'spec'}));
});
