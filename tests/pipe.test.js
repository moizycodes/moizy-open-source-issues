const test = require('node:test');
const assert = require('node:assert/strict');

const pipe = require('../utils/pipe');

const addOne = (value) => value + 1;
const double = (value) => value * 2;
const toString = (value) => String(value);
const trim = (value) => value.trim();
const toUpperCase = (value) => value.toUpperCase();
const addPrefix = (value) => `Mr. ${value}`;

test('pipe runs functions from left to right', () => {
  assert.equal(pipe(addOne, double)(5), 12);
  assert.equal(pipe(double, addOne)(5), 11);
});

test('pipe returns the input unchanged when given no functions', () => {
  assert.equal(pipe()(5), 5);
});

test('pipe works with a single function', () => {
  assert.equal(pipe(addOne)(5), 6);
});

test('pipe passes each result to the next function', () => {
  assert.equal(pipe(addOne, double, toString)(5), '12');
  assert.equal(pipe(addPrefix, toUpperCase, trim)('moeez'), 'MR. MOEEZ');
  assert.equal(pipe((user) => user.name, toUpperCase)({ name: 'naveen' }), 'NAVEEN');
});

test('pipe skips values that are not functions', () => {
  assert.equal(pipe(addOne, 'invalid', double)(5), 12);
});
