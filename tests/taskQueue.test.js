const test = require('node:test');
const assert = require('node:assert/strict');

const TaskQueue = require('../utils/TaskQueue');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('TaskQueue runs tasks one at a time in the order they were added', async () => {
  const queue = new TaskQueue();
  const results = [];

  queue.add(async () => {
    await wait(20);
    results.push('First');
  });

  queue.add(async () => {
    results.push('Second');
  });

  assert.equal(queue.size(), 2);

  await queue.process();

  assert.deepEqual(results, ['First', 'Second']);
  assert.equal(queue.size(), 0);
  assert.equal(queue.isProcessing(), false);
});

test('TaskQueue reports that it is processing while tasks run', async () => {
  const queue = new TaskQueue();
  queue.add(() => wait(10));

  const processing = queue.process();

  assert.equal(queue.isProcessing(), true);
  await processing;
  assert.equal(queue.isProcessing(), false);
});

test('TaskQueue keeps processing after a task fails', async () => {
  const queue = new TaskQueue();
  const results = [];

  queue.add(async () => {
    throw new Error('Task failed');
  });
  queue.add(async () => {
    results.push('Second');
  });

  await queue.process();

  assert.deepEqual(results, ['Second']);
});

test('TaskQueue.add rejects tasks that are not functions', () => {
  const queue = new TaskQueue();

  assert.throws(() => queue.add('not a function'), TypeError);
});
