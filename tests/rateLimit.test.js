const test = require('node:test');
const assert = require('node:assert/strict');

const rateLimit = require('../utils/rateLimit');

test('rateLimit allows calls up to the limit and then throws', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const limited = rateLimit((value) => value * 2, { limit: 2, interval: 1000 });

  assert.equal(limited(1), 2);
  assert.equal(limited(2), 4);
  assert.throws(() => limited(3), { message: 'Rate limit exceeded' });
});

test('rateLimit allows calls again once the interval has passed', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const limited = rateLimit(() => 'ok', { limit: 1, interval: 1000 });

  assert.equal(limited(), 'ok');
  t.mock.timers.tick(999);
  assert.throws(() => limited(), { message: 'Rate limit exceeded' });
  t.mock.timers.tick(1);
  assert.equal(limited(), 'ok');
});

test('rateLimit does not call the function when the limit is exceeded', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const fn = t.mock.fn();
  const limited = rateLimit(fn, { limit: 1, interval: 1000 });

  limited();
  assert.throws(() => limited());
  assert.equal(fn.mock.callCount(), 1);
});

test('rateLimit preserves the this context and arguments', () => {
  const counter = {
    total: 10,
    add: rateLimit(function add(a, b) {
      return this.total + a + b;
    }, { limit: 1, interval: 1000 }),
  };

  assert.equal(counter.add(1, 2), 13);
});

test('rateLimit validates its arguments', () => {
  assert.throws(() => rateLimit('nope', { limit: 1, interval: 1 }), TypeError);
  assert.throws(() => rateLimit(() => {}), TypeError);
  assert.throws(() => rateLimit(() => {}, { limit: 0, interval: 1 }), RangeError);
  assert.throws(() => rateLimit(() => {}, { limit: 1, interval: -5 }), RangeError);
  assert.throws(() => rateLimit(() => {}, { limit: '1', interval: 1 }), RangeError);
});
