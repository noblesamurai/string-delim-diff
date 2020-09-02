const expect = require('chai').expect;
const map = require('..');

describe('lib/map', () => {
  it.only('should map correctly one list of strings onto another', () => {
    const out = map(['a', 'b c', 'd e f'], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['a', 'b c'], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f'], more: false }
    ]);
  });

  it('should work with an empty string at the start of the array', () => {
    const out = map(['', 'a', 'b c', 'd e f'], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['', 'a', 'b c'], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f'], more: false }
    ]);
  });

  it('should work with an empty string at the end of the array', () => {
    const out = map(['a', 'b c', 'd e f', ''], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['a', 'b c'], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f', ''], more: false }
    ]);
  });

  it('should work with a null value in the array', () => {
    const out = map(['a', 'b c', null, 'd e f'], ['a b c', 'd e', 'f']);
    expect(out).to.eql([
      { segments: ['a', 'b c', ''], more: false },
      { segments: ['d e'], more: true },
      { segments: ['f'], more: false }
    ]);
  });

  it('should handle differences in whitespace', () => {
    const out = map(
      ['Hello Bob ...', 'You are great.'],
      ['Hello Bob', '...You are great.']
    );
    expect(out).to.eql([
      { segments: ['Hello Bob'], more: true },
      { segments: [' ...', 'You are great.'], more: false }
    ]);
  });

  it('is ok with unicode space chars', () => {
    const out = map(
      ['A melhor fonte é mesmo o sol.', '\u200B e ai gostou'],
      ['A melhor fonte é mesmo o sol.\u200B', 'e ai gostou']
    );
    expect(out).to.not.be.false();
  });

  it('works on this bad case', () => {
    const { sceneTexts, sentenceTexts } = require('./bad-case.json');
    const out = map(sceneTexts, sentenceTexts);
    const segments = out.map(mapping => mapping.segments).flat();
    expect(out.length).to.equal(sentenceTexts.length);
    expect(segments.length).to.equal(sceneTexts.length);
  });

  it('works on this bad case (simpler)', () => {
    const { sceneTexts, sentenceTexts } = {
      sceneTexts: ['a', 'b', '.'],
      sentenceTexts: ['a', 'b', '.']
    };
    const out = map(sceneTexts, sentenceTexts);
    const segments = out.map(mapping => mapping.segments).flat();
    expect(out.length).to.equal(sentenceTexts.length);
    expect(segments.length).to.equal(sceneTexts.length);
  });
});
