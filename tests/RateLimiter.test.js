const test = require('node:test');
const assert = require('node:assert/strict');

const RateLimiter = require('../rate-limiter/RateLimiter');

test('RateLimiter allows requests up to the limit and blocks the rest', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const limiter = new RateLimiter(2, 3000);

  assert.equal(limiter.allow(), true);
  assert.equal(limiter.allow(), true);
  assert.equal(limiter.allow(), false);
});

test('RateLimiter allows requests again after the duration has passed', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const limiter = new RateLimiter(2, 3000);

  limiter.allow();
  limiter.allow();

  t.mock.timers.tick(2999);
  assert.equal(limiter.allow(), false);

  t.mock.timers.tick(1);
  assert.equal(limiter.allow(), true);
});

test('RateLimiter reports how many requests remain', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const limiter = new RateLimiter(2, 3000);

  assert.equal(limiter.remainingRequests(), 2);
  limiter.allow();
  assert.equal(limiter.remainingRequests(), 1);
  limiter.allow();
  assert.equal(limiter.remainingRequests(), 0);

  t.mock.timers.tick(3000);
  assert.equal(limiter.remainingRequests(), 2);
});

test('RateLimiter rejects a limit or duration that is not a positive number', () => {
  assert.throws(() => new RateLimiter(0, 1000), RangeError);
  assert.throws(() => new RateLimiter(2, -1), RangeError);
  assert.throws(() => new RateLimiter('2', 1000), RangeError);
});
