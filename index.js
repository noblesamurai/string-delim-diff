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
module.exports = function (strings, toStrings) {
  // validate that string matches toStrings in the first place.
  if (sanitize(strings.join(' ')) !== sanitize(toStrings.join(' '))) {
    return false;
  }

  const stringWordCounts = strings.map(function (string) {
    return splitIntoWords(string).length;
  });
  return toStrings.reduce(function (map, toString) {
    const words = splitIntoWords(toString);
    let stringWordCount = stringWordCounts.shift();
    const segments = [];
    while (stringWordCounts.length && stringWordCount < words.length) {
      segments.push(stringWordCount ? words.splice(0, stringWordCount).join(' ') : '');
      stringWordCount = stringWordCounts.shift();
    }
    stringWordCount -= words.length;
    segments.push(words.join(' '));
    // if words remaining, push back onto the start of the word counts list
    if (stringWordCount) {
      stringWordCounts.unshift(stringWordCount);
    // otherwise, check and add any empty entrys to the end of the current segment
    // before we continue.
    } else {
      while (stringWordCounts.length && stringWordCounts[0] === 0) {
        segments.push('');
        stringWordCounts.shift();
      }
    }
    return map.concat([{ segments: segments, more: Boolean(stringWordCount) }]);
  }, []);
};

function sanitize (text) {
  // replace all punctuation with a space (punctuation still denotes a gap).
  // Note: we don't want to remove ''s which are in some words in the htk dictionary.
  return (text || '').replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/^\s|\s$/g, ''); // and trim
}

function splitIntoWords (text) {
  text = sanitize(text);
  if (!text.length) return []; // return empty array if empty string.
  return text.split(/\s+/);
}
