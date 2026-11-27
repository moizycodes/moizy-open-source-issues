const test = require('node:test');
const assert = require('node:assert/strict');

const retryAsync = require('../utils/retryAsync');

// Runs scheduled callbacks straight away and records the delay that was asked for.
const recordDelays = (t) => {
  const delays = [];
  const realSetTimeout = global.setTimeout;
  t.mock.method(global, 'setTimeout', (callback, ms) => {
    delays.push(ms);
    return realSetTimeout(callback, 0);
  });
  return delays;
};

const failTimes = (failures, value = 'done') => {
  let calls = 0;
  const fn = async () => {
    calls++;
    if (calls <= failures) throw new Error(`failure ${calls}`);
    return value;
  };
  fn.calls = () => calls;
  return fn;
};

test('retryAsync returns the result without retrying when the first call succeeds', async () => {
  const fn = failTimes(0);

  assert.equal(await retryAsync(fn, { retries: 3, delay: 0 }), 'done');
  assert.equal(fn.calls(), 1);
});

test('retryAsync retries until the function succeeds', async () => {
  const fn = failTimes(2);

  assert.equal(await retryAsync(fn, { retries: 3, delay: 0 }), 'done');
  assert.equal(fn.calls(), 3);
});

test('retryAsync rejects with the last error after using all retries', async () => {
  const fn = failTimes(Infinity);

  await assert.rejects(retryAsync(fn, { retries: 2, delay: 0 }), { message: 'failure 3' });
  assert.equal(fn.calls(), 3);
});

test('retryAsync does not retry when retries is 0', async () => {
  const fn = failTimes(Infinity);

  await assert.rejects(retryAsync(fn, { retries: 0, delay: 0 }), { message: 'failure 1' });
  assert.equal(fn.calls(), 1);
});

test('retryAsync doubles the delay between attempts by default', async (t) => {
  const delays = recordDelays(t);

  await retryAsync(failTimes(3), { retries: 3, delay: 100 });

  assert.deepEqual(delays, [100, 200, 400]);
});

test('retryAsync keeps the delay constant when backoff is false', async (t) => {
  const delays = recordDelays(t);

  await retryAsync(failTimes(3), { retries: 3, delay: 100, backoff: false });

  assert.deepEqual(delays, [100, 100, 100]);
});

test('retryAsync validates its arguments', async () => {
  await assert.rejects(retryAsync('nope'), TypeError);
  await assert.rejects(retryAsync(async () => {}, { retries: -1 }), RangeError);
  await assert.rejects(retryAsync(async () => {}, { delay: -1 }), RangeError);
});
