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
});
