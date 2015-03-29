'use strict';

var expect = require('chai').expect;
var getPrompt = require('./getPrompt');

describe('getPrompt', function() {
  it('should be a function', function() {
    expect(getPrompt()).to.be.ok;
  });
});