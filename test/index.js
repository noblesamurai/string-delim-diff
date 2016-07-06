'use strict';

var expect = require('expect.js'),
    map = require('..');

describe('lib/map', function() {
  it('should map correctly one list of strings onto another', function() {
    var out = map(['a', 'b c', 'd e f'], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['a', 'b c'], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f'], more: false }
    ]);
  });

  it('should work with an empty value in the array', function() {
    var out = map(['', 'a', 'b c', 'd e f'], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['', 'a', 'b c'], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f'], more: false }
    ]);

    var out = map(['a', 'b c', 'd e f', ''], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['a', 'b c'], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f', ''], more: false }
    ]);

    var out = map(['a', 'b c', null, 'd e f'], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['a', 'b c', ''], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f'], more: false }
    ]);
  });
  it('should handle differences in whitespace', function() {
    var out = map(['Hello Bob ...', 'You are great.'], ['Hello Bob', '...You are great.']);
    expect(out).to.eql([
      { segments: ['Hello Bob'], more: false },
      { segments: ['You are great'], more: false }
    ]);
  });
  it('is ok with unicode space chars', function() {
    var out = map(['A melhor fonte é mesmo o sol.', '\u200B e ai gostou'], ['A melhor fonte é mesmo o sol.\u200B', 'e ai gostou']);
    expect(out).to.not.be(false);
  });
});
