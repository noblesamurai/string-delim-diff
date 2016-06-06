var S = require('string');

/**
 * Map one array of strings onto another array of strings.
 *
 * map(['a', 'b c', 'd e f'], ['a b c', 'd e', 'f']); returns...
 *
 * [ { segments: [ 'a', 'b c' ], more: false },
 *   // contains both 'a' and 'b c'
 *   { segments: [ 'd e' ], more: true },
 *   // 'd e' contains the start of 'd e f', more tells us if we overlap into the next item.
 *   { segments: [ 'f' ], more: false } ]
 *   // 'f' contains the end of 'd e f'
 *
 * Returns false if strings cannot be mapped onto toStrings.
 */
module.exports = function(strings, toStrings) {
  // validate that string matches toStrings in the first place.
  if (sanitize(strings.join(' ')) != sanitize(toStrings.join(' '))) {
    return false;
  }

  var stringWordCounts = strings.map(function(string) {
    return splitIntoWords(string).length;
  });
  return toStrings.reduce(function(map, toString) {
    var words = splitIntoWords(toString),
        stringWordCount = stringWordCounts.shift(),
        segments = [];
    while (stringWordCounts.length && stringWordCount < words.length) {
      segments.push(stringWordCount ? words.splice(0, stringWordCount).join(' ') : '');
      stringWordCount = stringWordCounts.shift();
    }
    stringWordCount -= words.length;
    if (stringWordCount) stringWordCounts.unshift(stringWordCount);
    segments.push(words.join(' '));
    return map.concat([{ segments: segments, more: Boolean(stringWordCount) }]);
  }, []);
};

function sanitize(text) {
  return S(text || '').stripTags().decodeHTMLEntities().collapseWhitespace().s;
}
function splitIntoWords(text) {
  text = sanitize(text);
  if (!text.length) return []; // return empty array if empty string.
  return text.split(/\s+/);
}

