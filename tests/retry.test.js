'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const retry = require('../utils/retry');

// Runs every wait straight away and records how long it asked for, so the
// tests check the requested delays instead of measuring real elapsed time.
const recordDelays = (t) => {
  const delays = [];
  const realSetTimeout = global.setTimeout;
  t.mock.method(global, 'setTimeout', (callback, ms) => {
    delays.push(ms);
    return realSetTimeout(callback, 0);
  });
  return delays;
};

// 1. Function succeeds on first attempt
test('succeeds on first attempt', async (t) => {
  const delays = recordDelays(t);
  const fn = async () => 'done';

  assert.equal(await retry(fn), 'done');
  assert.deepEqual(delays, []);
});

// 2. Function succeeds after retries
test('succeeds after retries', async (t) => {
  recordDelays(t);
  let attempts = 0;
  const fn = async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error('fail');
    }
    return 'success';
  };

  assert.equal(await retry(fn, { retries: 3, delay: 10, factor: 2 }), 'success');
  assert.equal(attempts, 3);
});

// 3. Maximum retries reached
test('maximum retries reached', async (t) => {
  recordDelays(t);
  const fn = async () => {
    throw new Error('always fails');
  };

  await assert.rejects(retry(fn, { retries: 2, delay: 10 }), { message: 'always fails' });
});

// 4. Custom retry count
test('custom retry count', async (t) => {
  recordDelays(t);
  let callCount = 0;
  const fn = async () => {
    callCount++;
    throw new Error('always fails');
  };

  await assert.rejects(retry(fn, { retries: 5, delay: 10 }));
  assert.equal(callCount, 6);
});

// 5. Custom delay
test('custom delay is respected', async (t) => {
  const delays = recordDelays(t);
  let attempts = 0;
  const fn = async () => {
    attempts++;
    if (attempts < 2) {
      throw new Error('fail');
    }
    return 'ok';
  };

  await retry(fn, { retries: 3, delay: 100, factor: 1 });

  // One failure means exactly one wait.
  assert.deepEqual(delays, [100]);
});

// 6. Exponential delay calculation
test('delay grows exponentially', async (t) => {
  const delays = recordDelays(t);
  let attempts = 0;
  const fn = async () => {
    attempts++;
    if (attempts < 4) {
      throw new Error('fail');
    }
    return 'ok';
  };

  await retry(fn, { retries: 3, delay: 50, factor: 2 });

  assert.deepEqual(delays, [50, 100, 200]);
});

// 7. Invalid options (e.g. null shouldn't crash unexpectedly)
test('invalid options do not crash unexpectedly', async () => {
  const fn = async () => 'ok';

  assert.equal(await retry(fn, null), 'ok');
});

// 8. Non-function input
test('non-function input throws TypeError', async () => {
  await assert.rejects(retry(null), TypeError);
});

// 9. Error propagation after final retry
test('propagates the original error after final retry', async (t) => {
  recordDelays(t);
  const original = new Error('specific failure message');
  const fn = async () => {
    throw original;
  };

  await assert.rejects(retry(fn, { retries: 1, delay: 10 }), (error) => error === original);
});
