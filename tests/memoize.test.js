const test = require('node:test');
const assert = require('node:assert/strict');

const memoize = require('../utils/memoize');

test('memoize returns the cached result for repeated arguments', (t) => {
  const add = t.mock.fn((a, b) => a + b);
  const memoized = memoize(add);

  assert.equal(memoized(1, 2), 3);
  assert.equal(memoized(1, 2), 3);
  assert.equal(add.mock.callCount(), 1);
});

test('memoize calls the function again for different arguments', (t) => {
  const add = t.mock.fn((a, b) => a + b);
  const memoized = memoize(add);

  assert.equal(memoized(1, 2), 3);
  assert.equal(memoized(2, 1), 3);
  assert.equal(memoized(5, 5), 10);
  assert.equal(add.mock.callCount(), 3);
});

test('memoize treats object arguments with the same content as the same call', (t) => {
  const getName = t.mock.fn((user) => user.name);
  const memoized = memoize(getName);

  assert.equal(memoized({ name: 'Moeez' }), 'Moeez');
  assert.equal(memoized({ name: 'Moeez' }), 'Moeez');
  assert.equal(getName.mock.callCount(), 1);
});

test('memoize caches falsy results', (t) => {
  const returnsZero = t.mock.fn(() => 0);
  const returnsUndefined = t.mock.fn(() => undefined);
  const memoizedZero = memoize(returnsZero);
  const memoizedUndefined = memoize(returnsUndefined);

  memoizedZero();
  memoizedZero();
  memoizedUndefined();
  memoizedUndefined();

  assert.equal(returnsZero.mock.callCount(), 1);
  assert.equal(returnsUndefined.mock.callCount(), 1);
});

test('memoize preserves the this context', () => {
  const calculator = {
    base: 10,
    add: memoize(function add(value) {
      return this.base + value;
    })
  };

  assert.equal(calculator.add(5), 15);
});

test('memoize keeps a separate cache for each memoized function', (t) => {
  const double = t.mock.fn((value) => value * 2);
  const first = memoize(double);
  const second = memoize(double);

  first(2);
  second(2);

  assert.equal(double.mock.callCount(), 2);
});
