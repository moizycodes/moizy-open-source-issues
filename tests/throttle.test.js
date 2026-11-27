const test = require('node:test');
const assert = require('node:assert/strict');

const throttle = require('../utils/throttle');

const useFakeTime = (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 1000 });
  return t.mock.timers;
};

test('throttle runs the first call immediately and returns its result', (t) => {
  useFakeTime(t);
  const fn = t.mock.fn((value) => value * 2);
  const throttled = throttle(fn, 100);

  assert.equal(throttled(2), 4);
  assert.equal(fn.mock.callCount(), 1);
});

test('throttle skips calls made during the delay and returns the last result', (t) => {
  useFakeTime(t);
  const fn = t.mock.fn((value) => value * 2);
  const throttled = throttle(fn, 100);

  throttled(2);

  assert.equal(throttled(3), 4);
  assert.equal(throttled(4), 4);
  assert.equal(fn.mock.callCount(), 1);
});

test('throttle runs the last skipped call once the delay has passed', (t) => {
  const timers = useFakeTime(t);
  const fn = t.mock.fn();
  const throttled = throttle(fn, 100);

  throttled('first');
  throttled('second');
  throttled('third');

  timers.tick(99);
  assert.equal(fn.mock.callCount(), 1);

  timers.tick(1);
  assert.equal(fn.mock.callCount(), 2);
  assert.deepEqual(fn.mock.calls[1].arguments, ['third']);
});

test('throttle does not run a trailing call when nothing was skipped', (t) => {
  const timers = useFakeTime(t);
  const fn = t.mock.fn();
  const throttled = throttle(fn, 100);

  throttled();
  timers.tick(500);

  assert.equal(fn.mock.callCount(), 1);
});

test('throttle runs immediately again after the delay has passed', (t) => {
  const timers = useFakeTime(t);
  const fn = t.mock.fn();
  const throttled = throttle(fn, 100);

  throttled('first');
  timers.tick(100);
  throttled('second');

  assert.equal(fn.mock.callCount(), 2);
  assert.deepEqual(fn.mock.calls[1].arguments, ['second']);
});

test('throttle drops skipped calls when trailing is false', (t) => {
  const timers = useFakeTime(t);
  const fn = t.mock.fn();
  const throttled = throttle(fn, 100, { trailing: false });

  throttled('first');
  throttled('second');
  timers.tick(100);

  assert.equal(fn.mock.callCount(), 1);

  throttled('third');

  assert.equal(fn.mock.callCount(), 2);
  assert.deepEqual(fn.mock.calls[1].arguments, ['third']);
});

test('throttle preserves the this context for immediate and trailing calls', (t) => {
  const timers = useFakeTime(t);
  const contexts = [];
  const target = {
    record: throttle(function record() {
      contexts.push(this);
    }, 100),
  };

  target.record();
  target.record();
  timers.tick(100);

  assert.deepEqual(contexts, [target, target]);
});

test('throttle validates its arguments', () => {
  assert.throws(() => throttle('nope', 100), TypeError);
  assert.throws(() => throttle(() => {}, '100'), TypeError);
  assert.throws(() => throttle(() => {}, NaN), TypeError);
});
