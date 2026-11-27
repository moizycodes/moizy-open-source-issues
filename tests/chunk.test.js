const test = require('node:test');
const assert = require('node:assert/strict');

const chunk = require('../utils/chunk');

test('chunk splits an array into groups of the given size', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5, 6], 2), [[1, 2], [3, 4], [5, 6]]);
});

test('chunk puts leftover items in a smaller final group', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test('chunk returns a single group when the size is larger than the array', () => {
  assert.deepEqual(chunk([1, 2], 5), [[1, 2]]);
});

test('chunk returns an empty array for an empty array', () => {
  assert.deepEqual(chunk([], 2), []);
});

test('chunk returns an empty array for invalid input', () => {
  assert.deepEqual(chunk(null, 2), []);
  assert.deepEqual(chunk([1, 2, 3], 0), []);
});
