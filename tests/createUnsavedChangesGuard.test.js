const { test, assertEquals, assertThrows, printSummary } = require('./test-utils.js');
const { createUnsavedChangesGuard } = require('../utils/createUnsavedChangesGuard.js');

const createEventTarget = () => {
  const listeners = new Map();
  const calls = { added: 0, removed: 0 };

  return {
    calls,
    addEventListener(type, listener) {
      calls.added++;
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      calls.removed++;
      listeners.get(type)?.delete(listener);
    },
    dispatch(type, event) {
      for (const listener of listeners.get(type) || []) listener(event);
    },
    listenerCount(type) {
      return listeners.get(type)?.size || 0;
    },
  };
};

const createBeforeUnloadEvent = () => ({
  prevented: false,
  returnValue: undefined,
  preventDefault() {
    this.prevented = true;
  },
});

test('starts clean', () => {
  const guard = createUnsavedChangesGuard(createEventTarget());
  assertEquals(guard.isDirty(), false);
});

test('markDirty changes the state and registers beforeunload', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);

  guard.markDirty();

  assertEquals(guard.isDirty(), true);
  assertEquals(target.listenerCount('beforeunload'), 1);
});

test('markClean resets the state and removes beforeunload', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);

  guard.markDirty();
  guard.markClean();

  assertEquals(guard.isDirty(), false);
  assertEquals(target.listenerCount('beforeunload'), 0);
});

test('dirty state prevents the default beforeunload behavior', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);
  const event = createBeforeUnloadEvent();

  guard.markDirty();
  target.dispatch('beforeunload', event);

  assertEquals(event.prevented, true);
  assertEquals(event.returnValue, '');
});

test('clean state does not trigger a beforeunload warning', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);
  const event = createBeforeUnloadEvent();

  target.dispatch('beforeunload', event);

  assertEquals(event.prevented, false);
  assertEquals(event.returnValue, undefined);
});

test('repeated markDirty calls register only one listener', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);

  guard.markDirty();
  guard.markDirty();
  guard.markDirty();

  assertEquals(target.listenerCount('beforeunload'), 1);
  assertEquals(target.calls.added, 1);
});

test('repeated markClean calls are safe', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);

  guard.markClean();
  guard.markDirty();
  guard.markClean();
  guard.markClean();

  assertEquals(guard.isDirty(), false);
  assertEquals(target.listenerCount('beforeunload'), 0);
  assertEquals(target.calls.removed, 1);
});

test('destroy removes the listener and clears dirty state', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);

  guard.markDirty();
  guard.destroy();

  assertEquals(guard.isDirty(), false);
  assertEquals(target.listenerCount('beforeunload'), 0);
});

test('destroy can be called repeatedly', () => {
  const target = createEventTarget();
  const guard = createUnsavedChangesGuard(target);

  guard.markDirty();
  guard.destroy();
  guard.destroy();

  assertEquals(target.calls.removed, 1);
  assertEquals(guard.isDirty(), false);
});

test('multiple guards on one target remain independent', () => {
  const target = createEventTarget();
  const first = createUnsavedChangesGuard(target);
  const second = createUnsavedChangesGuard(target);

  first.markDirty();
  second.markDirty();
  first.markClean();

  assertEquals(first.isDirty(), false);
  assertEquals(second.isDirty(), true);
  assertEquals(target.listenerCount('beforeunload'), 1);

  const event = createBeforeUnloadEvent();
  target.dispatch('beforeunload', event);
  assertEquals(event.prevented, true);
});

test('destroying one guard does not remove another guard listener', () => {
  const target = createEventTarget();
  const first = createUnsavedChangesGuard(target);
  const second = createUnsavedChangesGuard(target);

  first.markDirty();
  second.markDirty();
  first.destroy();

  assertEquals(target.listenerCount('beforeunload'), 1);
  assertEquals(second.isDirty(), true);
});

test('existing beforeunload handlers are preserved', () => {
  const target = createEventTarget();
  let existingHandlerCalls = 0;
  const existingHandler = () => existingHandlerCalls++;
  target.addEventListener('beforeunload', existingHandler);

  const guard = createUnsavedChangesGuard(target);
  guard.markDirty();
  guard.markClean();
  target.dispatch('beforeunload', createBeforeUnloadEvent());

  assertEquals(existingHandlerCalls, 1);
  assertEquals(target.listenerCount('beforeunload'), 1);
});

test('markDirty after destroy throws a clear error', () => {
  const guard = createUnsavedChangesGuard(createEventTarget());
  guard.destroy();

  assertThrows(() => guard.markDirty(), 'destroyed');
});

test('rejects targets without event listener methods', () => {
  assertThrows(() => createUnsavedChangesGuard({}), 'target');
  assertThrows(() => createUnsavedChangesGuard(null), 'target');
});

test('works without a browser window for state-only use', () => {
  const guard = createUnsavedChangesGuard();

  guard.markDirty();
  assertEquals(guard.isDirty(), true);
  guard.markClean();
  assertEquals(guard.isDirty(), false);
});

printSummary();
