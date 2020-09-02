const last = require('lodash.last');
const sanitize = require('./lib/sanitize');

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
  // Validate that string matches toStrings in the first place.
  if (
    strings.join('').replace(/\s+/g, '') !==
    toStrings.join('').replace(/\s+/g, '')
  ) return false;

  const stringWordCounts = strings.map(string => {
    return splitIntoWords(string).length;
  });
  // eslint-disable-next-line unicorn/no-reduce
  return toStrings.reduce((map, toString) => {
    const words = splitIntoWords(toString);
    console.log({ words });
    let stringWordCount = stringWordCounts.shift();
    const segments = [];
    while (stringWordCounts.length && stringWordCount < words.length) {
      segments.push(stringWordCount ? words.splice(0, stringWordCount).join(' ') : '');
      stringWordCount = stringWordCounts.shift();
    }

    stringWordCount -= words.length;
    segments.push(words.join(' '));
    // If words remaining, push back onto the start of the word counts list
    console.log({ stringWordCount });
    if (stringWordCount) {
      stringWordCounts.unshift(stringWordCount);
    // Otherwise, check and add any empty entrys to the end of the current segment
    // before we continue.
    } else {
      while (stringWordCounts.length && stringWordCounts[0] === 0) {
        segments.push('');
        stringWordCounts.shift();
      }
    }

    return map.concat([{ segments, more: Boolean(stringWordCount) }]);
  }, []);
};

function splitIntoWords (text) {
  text = sanitize(text);
  if (text.length === 0) return []; // Return empty array if empty string.
  return text.split(/\s+/);
}

module.exports = function (strings, toStrings) {
  const returnValue = [];
  for (const string2 of toStrings) {
    const current = [''];
    for (const c2 of string2) {
      // Consume any spaces in c2
      if (/\s/.test(c2)) {
        current[current.length - 1] = last(current) + c2;
        continue;
      }

      const string1 = strings.shift();
      for (const c1 of string1) {
        console.log({ c1, string1, c2, string2, current, returnValue });
        if (/\s/.test(c1)) continue; // Consume spaces
        if (c1 === c2) {
          current[current.length - 1] = last(current) + c2;
          const remainder = string1.slice(1);
          console.log({ remainder });
          if (remainder.length > 0) strings.unshift(remainder); // eslint-disable-line max-depth
          break; // Next char in toString
        }

        console.log('no match');

        return false;
      }
    }

    returnValue.push({ segments: current, more: false });
  }

  return returnValue;
};
