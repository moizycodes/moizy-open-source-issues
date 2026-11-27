const test = require('node:test');
const assert = require('node:assert/strict');

const withTimeout = require('../utils/withTimeout');

test('withTimeout resolves with the value of a promise that settles in time', async () => {
  assert.equal(await withTimeout(Promise.resolve('done'), 1000), 'done');
});

test('withTimeout rejects with the original error when the promise rejects in time', async () => {
  await assert.rejects(withTimeout(Promise.reject(new Error('boom')), 1000), { message: 'boom' });
});

test('withTimeout rejects when the promise takes longer than the timeout', async () => {
  const neverSettles = new Promise(() => {});

  await assert.rejects(withTimeout(neverSettles, 10), {
    message: 'withTimeout: operation timed out after 10ms',
  });
});

test('withTimeout clears its timer once the promise settles', async (t) => {
  const clearTimeoutSpy = t.mock.method(global, 'clearTimeout');

  await withTimeout(Promise.resolve('done'), 1000);

  assert.equal(clearTimeoutSpy.mock.callCount(), 1);
});

test('withTimeout accepts any thenable', async () => {
  const thenable = { then: (resolve) => resolve('from thenable') };

  assert.equal(await withTimeout(thenable, 1000), 'from thenable');
});

test('withTimeout rejects with a TypeError when not given a promise', async () => {
  await assert.rejects(withTimeout(null, 1000), TypeError);
  await assert.rejects(withTimeout('not a promise', 1000), TypeError);
});

test('withTimeout rejects with a RangeError when the timeout is not positive', async () => {
  await assert.rejects(withTimeout(Promise.resolve(), 0), RangeError);
  await assert.rejects(withTimeout(Promise.resolve(), -5), RangeError);
});
