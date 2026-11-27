const test = require('node:test');
const assert = require('node:assert/strict');

const deepEqual = require('../utils/deepEqual');

test('deepEqual compares primitives strictly', () => {
  assert.equal(deepEqual(1, 1), true);
  assert.equal(deepEqual('a', 'a'), true);
  assert.equal(deepEqual(1, '1'), false);
  assert.equal(deepEqual(1, 2), false);
});

test('deepEqual handles null and undefined', () => {
  assert.equal(deepEqual(null, null), true);
  assert.equal(deepEqual(undefined, undefined), true);
  assert.equal(deepEqual(null, undefined), false);
  assert.equal(deepEqual(null, {}), false);
});

test('deepEqual treats empty objects and empty arrays as equal to themselves', () => {
  assert.equal(deepEqual({}, {}), true);
  assert.equal(deepEqual([], []), true);
  assert.equal(deepEqual([], {}), false);
});

test('deepEqual compares arrays by value and order', () => {
  assert.equal(deepEqual([1, 2, 3], [1, 2, 3]), true);
  assert.equal(deepEqual([1, 2], [2, 1]), false);
  assert.equal(deepEqual([1, 2], [1, 2, 3]), false);
});

test('deepEqual compares nested objects', () => {
  assert.equal(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }), true);
  assert.equal(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } }), false);
});

test('deepEqual ignores key order', () => {
  assert.equal(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
});

test('deepEqual detects missing and extra keys', () => {
  assert.equal(deepEqual({ a: 1 }, { a: 1, b: 2 }), false);
  assert.equal(deepEqual({ a: 1, b: undefined }, { a: 1, c: undefined }), false);
});

test('deepEqual compares objects that contain arrays', () => {
  assert.equal(
    deepEqual(
      { user: { name: 'Naveen', roles: ['student', 'developer'] } },
      { user: { name: 'Naveen', roles: ['student', 'developer'] } }
    ),
    true
  );
  assert.equal(
    deepEqual(
      { user: { name: 'Naveen', roles: ['developer', 'student'] } },
      { user: { name: 'Naveen', roles: ['student', 'developer'] } }
    ),
    false
  );
});

test('deepEqual compares functions by reference', () => {
  const firstFunction = () => true;
  const secondFunction = () => true;

  assert.equal(deepEqual(firstFunction, firstFunction), true);
  assert.equal(deepEqual(firstFunction, secondFunction), false);
});

test('deepEqual does not mutate its arguments', () => {
  const originalObject = { a: { b: 1 } };

  deepEqual(originalObject, { a: { b: 1 } });

  assert.deepEqual(originalObject, { a: { b: 1 } });
});
