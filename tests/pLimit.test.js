const test = require('node:test');
const assert = require('node:assert/strict');

const pLimit = require('../utils/pLimit');

const delay = (value, time) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(value);
  }, time);
});

test('pLimit never runs more tasks at once than the concurrency limit', async () => {
  const limit = pLimit(2);
  let activeCount = 0;
  let maxActiveCount = 0;

  const tasks = [1, 2, 3, 4].map((value) => limit(async () => {
    activeCount += 1;
    maxActiveCount = Math.max(maxActiveCount, activeCount);

    const result = await delay(value, 10);

    activeCount -= 1;
    return result;
  }));

  assert.deepEqual(await Promise.all(tasks), [1, 2, 3, 4]);
  assert.equal(maxActiveCount, 2);
});

test('pLimit resolves with the result of a synchronous task', async () => {
  const limit = pLimit(1);

  assert.equal(await limit(() => 'sync result'), 'sync result');
});

test('pLimit rejects when the task rejects', async () => {
  const limit = pLimit(1);

  await assert.rejects(limit(() => Promise.reject(new Error('Task failed'))), {
    message: 'Task failed'
  });
});

test('pLimit keeps running queued tasks after one rejects', async () => {
  const limit = pLimit(1);

  const results = await Promise.allSettled([
    limit(() => Promise.reject(new Error('First failed'))),
    limit(() => Promise.resolve('second task completed'))
  ]);

  assert.equal(results[0].status, 'rejected');
  assert.equal(results[1].value, 'second task completed');
});

test('pLimit throws when concurrency is not a positive integer', () => {
  const expected = { message: 'pLimit: concurrency must be a positive integer' };

  assert.throws(() => pLimit(0), expected);
  assert.throws(() => pLimit(-1), expected);
  assert.throws(() => pLimit(1.5), expected);
});

test('pLimit rejects when the task is not a function', async () => {
  const limit = pLimit(1);

  await assert.rejects(async () => limit('not a function'), {
    message: 'pLimit: task must be a function'
  });
});
