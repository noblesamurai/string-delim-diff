# string-delim-diff

Takes two arrays of strings, differently delimited (but identical otherwise) and gives you the mapping between them.

[![build status](https://secure.travis-ci.org/noblesamurai/string-delim-diff.png)](http://travis-ci.org/noblesamurai/string-delim-diff)

## Prerequisites

```
$ pip install pre-commit
```

## Installation

This module is installed via npm:

``` bash
$ pre-commit install --install-hooks
$ npm install string-delim-diff
```

## Example Usage

``` js
var stringDelimDiff = require('string-delim-diff'),
    expect = require('expect.js');

var out = map(['a', 'b c', 'd e f'], ['a b c', 'd e', 'f']);
expect(out).to.eql([
  { segments: ['a', 'b c'], more: false },
  { segments: ['d e'], more: true },
  { segments: ['f'], more: false }
]);

```
