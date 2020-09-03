const last = require('lodash.last');

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
function appendToLast (strings, char) {
  strings[strings.length - 1] += char;
}

/**
 * Should return false if toString can't be made from some prefix of strings.
 */
function getSegment (strings, toString) {
  let string1 = '';
  toString = toString.split('');
  const mapping = [];

  // Go through and match up between the strings/string
  while (toString.length > 0) {
    // Move on to next string1 if required.
    while (strings.length > 0 && string1.length === 0) {
      string1 = (strings.shift() || '').split(''); // Sometimes can get null in the array
      mapping.push('');
    }

    const [c1] = string1;
    const [c2] = toString;
    if (c1 === c2) {
      appendToLast(mapping, c2);
      string1.shift();
      toString.shift();
      continue; // Next char in toString
    }

    // Consume any spaces in string1
    if (/\s/.test(c1)) {
      string1.shift();
      continue;
    }

    // Consume any spaces in string2
    if (/\s/.test(c2)) {
      toString.shift();
      continue;
    }

    return false;
  }

  if (toString.length > 0) return false; // Couldn't make the full string.
  const more = string1.length > 0;
  if (more) strings.unshift(string1.join(''));
  return { segments: mapping, more };
}

module.exports = function (strings, toStrings) {
  strings = [...strings]; // FIXME: getSegments() is mutative on 'strings'
  const result = toStrings.map(toString => getSegment(strings, toString));
  if (result.some(r => r === false)) return false;
  // Push any remaining whitespace on
  if (strings.length > 0 && strings.join('').replace(/\s+/g, '').length === 0) last(result).segments = last(result).segments.concat(strings);
  else if (strings.length > 0) return false; // But if we had non-whitespace left, we fail.
  return !last(result).more && result;
};
