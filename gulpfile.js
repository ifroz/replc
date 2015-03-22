'use strict';
var gulp = require('gulp');
var replc = require('./replc');

gulp.task('default', ['replc']);
gulp.task('replc', function() {
  setTimeout(function() {
    replc({
      context: {
        expect: require('chai').expect
      }
    })
  });
});