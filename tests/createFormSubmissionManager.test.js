'use strict';

const assert = require('assert');
const createFormSubmissionManager = require('../utils/createFormSubmissionManager');

let passed = 0;
let failed = 0;

async function test(name, callback) {
  try {
    await callback();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL: ${name}`);
    console.error(error);
  }
}

function deferred() {
  let resolve;
  const promise = new Promise((res) => { resolve = res; });
  return { promise, resolve };
}

async function runTests() {
  await test('starts idle with a complete state snapshot', () => {
    const manager = createFormSubmissionManager();
    assert.deepStrictEqual(manager.getState(), { status: 'idle', data: null, error: null });
  });

  await test('transitions through submitting to success and stores the result', async () => {
    const manager = createFormSubmissionManager();
    const pending = deferred();
    const submission = manager.submit(() => pending.promise);
    assert.strictEqual(manager.getState().status, 'submitting');
    pending.resolve({ id: 42 });
    assert.deepStrictEqual(await submission, { id: 42 });
    assert.deepStrictEqual(manager.getState(), { status: 'success', data: { id: 42 }, error: null });
  });

  await test('supports synchronous callbacks and regular return values', async () => {
    const manager = createFormSubmissionManager();
    assert.strictEqual(await manager.submit(() => 7), 7);
    assert.deepStrictEqual(manager.getState(), { status: 'success', data: 7, error: null });
  });

  await test('prevents duplicate submissions and returns the existing promise', async () => {
    const manager = createFormSubmissionManager();
    const pending = deferred();
    let calls = 0;
    const first = manager.submit(() => { calls += 1; return pending.promise; });
    const second = manager.submit(() => { calls += 1; return 'ignored'; });
    assert.strictEqual(first, second);
    assert.strictEqual(calls, 0);
    await Promise.resolve();
    assert.strictEqual(calls, 1);
    pending.resolve('saved');
    assert.strictEqual(await second, 'saved');
    assert.strictEqual(calls, 1);
  });

  await test('stores and rethrows the original Error object', async () => {
    const manager = createFormSubmissionManager();
    const originalError = new Error('network unavailable');
    await assert.rejects(manager.submit(() => Promise.reject(originalError)), (error) => error === originalError);
    assert.strictEqual(manager.getState().status, 'error');
    assert.strictEqual(manager.getState().error, originalError);
  });

  await test('preserves non-Error rejection values', async () => {
    const manager = createFormSubmissionManager();
    const reason = { code: 'OFFLINE' };
    await assert.rejects(manager.submit(() => Promise.reject(reason)), (error) => error === reason);
    assert.strictEqual(manager.getState().error, reason);
  });

  await test('recovers after a failure and supports sequential submissions', async () => {
    const manager = createFormSubmissionManager();
    await assert.rejects(manager.submit(() => { throw new Error('first'); }));
    assert.strictEqual(manager.getState().status, 'error');
    assert.strictEqual(await manager.submit(() => 'second'), 'second');
    assert.deepStrictEqual(manager.getState(), { status: 'success', data: 'second', error: null });
  });

  await test('rejects invalid callbacks without changing the current state', () => {
    const manager = createFormSubmissionManager();
    for (const callback of [null, undefined, 1, 'submit', {}, []]) {
      assert.throws(() => manager.submit(callback), { name: 'TypeError' });
      assert.strictEqual(manager.getState().status, 'idle');
    }
  });

  await test('reset clears a successful state and returns a snapshot', async () => {
    const manager = createFormSubmissionManager();
    await manager.submit(() => 'saved');
    assert.deepStrictEqual(manager.reset(), { status: 'idle', data: null, error: null });
  });

  await test('reset clears a failed state', async () => {
    const manager = createFormSubmissionManager();
    await assert.rejects(manager.submit(() => { throw new Error('failed'); }));
    manager.reset();
    assert.deepStrictEqual(manager.getState(), { status: 'idle', data: null, error: null });
  });

  await test('reset during an active submission prevents stale completion from changing state', async () => {
    const manager = createFormSubmissionManager();
    const pending = deferred();
    const submission = manager.submit(() => pending.promise);
    await Promise.resolve();
    manager.reset();
    pending.resolve('late result');
    assert.strictEqual(await submission, 'late result');
    assert.deepStrictEqual(manager.getState(), { status: 'idle', data: null, error: null });
  });

  await test('allows a new submission after reset while an older callback is pending', async () => {
    const manager = createFormSubmissionManager();
    const oldPending = deferred();
    const oldSubmission = manager.submit(() => oldPending.promise);
    await Promise.resolve();
    manager.reset();
    assert.strictEqual(await manager.submit(() => 'new result'), 'new result');
    oldPending.resolve('old result');
    assert.strictEqual(await oldSubmission, 'old result');
    assert.deepStrictEqual(manager.getState(), { status: 'success', data: 'new result', error: null });
  });

  await test('getState returns a snapshot that cannot mutate internal state', () => {
    const manager = createFormSubmissionManager();
    const snapshot = manager.getState();
    snapshot.status = 'success';
    snapshot.data = 'tampered';
    assert.deepStrictEqual(manager.getState(), { status: 'idle', data: null, error: null });
  });

  await test('does not modify callback-owned data', async () => {
    const manager = createFormSubmissionManager();
    const data = { nested: { value: 1 } };
    const before = JSON.stringify(data);
    assert.strictEqual(await manager.submit(() => data), data);
    assert.strictEqual(JSON.stringify(data), before);
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
