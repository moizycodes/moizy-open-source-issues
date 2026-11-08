'use strict';

const createEventListenerTracker = require('../utils/createEventListenerTracker');

let passed = 0;
let failed = 0;

const test = async (name, fn) => {
  try {
    await fn();
    console.log(`PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(`  ${err.message}`);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

const assertEquals = (actual, expected, label = '') => {
  if (actual !== expected) {
    throw new Error(
      `${label ? label + ': ' : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
};

const assertThrows = (fn, ErrorType, label = '') => {
  try {
    fn();
  } catch (err) {
    if (!(err instanceof ErrorType)) {
      throw new Error(`${label ? label + ': ' : ''}expected ${ErrorType.name}, got ${err.name}`);
    }
    return;
  }
  throw new Error(`${label ? label + ': ' : ''}expected ${ErrorType.name} to be thrown`);
};

const createTarget = () => new EventTarget();

(async () => {
  await test('add registers a native listener and tracks it', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    let calls = 0;
    const handler = () => calls++;

    assertEquals(tracker.add(target, 'click', handler), true, 'add result');
    assertEquals(tracker.getActiveListeners().length, 1, 'active count');
    target.dispatchEvent(new Event('click'));
    assertEquals(calls, 1, 'native listener called');
  });

  await test('remove untracks and natively removes the listener', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    let calls = 0;
    const handler = () => calls++;

    tracker.add(target, 'click', handler);
    assertEquals(tracker.remove(target, 'click', handler), true, 'remove result');
    assertEquals(tracker.getActiveListeners().length, 0, 'active count');
    target.dispatchEvent(new Event('click'));
    assertEquals(calls, 0, 'listener should not be called');
  });

  await test('removing a listener that was never tracked returns false', async () => {
    const tracker = createEventListenerTracker();
    assertEquals(tracker.remove(createTarget(), 'click', () => {}), false, 'remove result');
  });

  await test('duplicate registration of same target/type/listener/capture is ignored', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    const handler = () => {};

    assertEquals(tracker.add(target, 'click', handler), true, 'first add');
    assertEquals(tracker.add(target, 'click', handler), false, 'second add');
    assertEquals(tracker.getActiveListeners().length, 1, 'active count');
  });

  await test('different capture settings are tracked separately', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    const handler = () => {};

    tracker.add(target, 'click', handler, false);
    tracker.add(target, 'click', handler, true);
    tracker.add(target, 'click', handler, { capture: true });
    assertEquals(tracker.getActiveListeners().length, 2, 'active count');
  });

  await test('same listener on different event types or targets is tracked separately', async () => {
    const tracker = createEventListenerTracker();
    const a = createTarget();
    const b = createTarget();
    const handler = () => {};

    tracker.add(a, 'click', handler);
    tracker.add(a, 'keydown', handler);
    tracker.add(b, 'click', handler);
    assertEquals(tracker.getActiveListeners().length, 3, 'active count');
  });

  await test('listener options are preserved in metadata', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    const options = { capture: false, once: true, passive: true };

    tracker.add(target, 'scroll', () => {}, options);
    const [entry] = tracker.getActiveListeners();
    assertEquals(entry.type, 'scroll', 'type');
    assertEquals(entry.target, target, 'target');
    assertEquals(entry.capture, false, 'capture');
    assertEquals(entry.options.once, true, 'once');
    assertEquals(entry.options.passive, true, 'passive');
  });

  await test('destroy removes all tracked listeners', async () => {
    const tracker = createEventListenerTracker();
    const button = createTarget();
    const win = createTarget();
    let calls = 0;
    const handleClick = () => calls++;
    const handleResize = () => calls++;

    tracker.add(button, 'click', handleClick);
    tracker.add(win, 'resize', handleResize);
    tracker.destroy();

    assertEquals(tracker.getActiveListeners().length, 0, 'active count');
    button.dispatchEvent(new Event('click'));
    win.dispatchEvent(new Event('resize'));
    assertEquals(calls, 0, 'no listener should fire after destroy');
  });

  await test('destroy can be called multiple times', async () => {
    const tracker = createEventListenerTracker();
    tracker.add(createTarget(), 'click', () => {});
    tracker.destroy();
    tracker.destroy();
    assertEquals(tracker.getActiveListeners().length, 0, 'active count');
  });

  await test('add throws after destroy', async () => {
    const tracker = createEventListenerTracker();
    tracker.destroy();
    assertThrows(() => tracker.add(createTarget(), 'click', () => {}), Error, 'add after destroy');
  });

  await test('invalid targets throw TypeError', async () => {
    const tracker = createEventListenerTracker();
    assertThrows(() => tracker.add(null, 'click', () => {}), TypeError, 'null target');
    assertThrows(() => tracker.add({}, 'click', () => {}), TypeError, 'plain object target');
    assertThrows(() => tracker.remove(undefined, 'click', () => {}), TypeError, 'undefined target');
  });

  await test('empty or non-string event types throw TypeError', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    assertThrows(() => tracker.add(target, '', () => {}), TypeError, 'empty type');
    assertThrows(() => tracker.add(target, '   ', () => {}), TypeError, 'blank type');
    assertThrows(() => tracker.add(target, 42, () => {}), TypeError, 'numeric type');
  });

  await test('invalid listeners throw TypeError', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    assertThrows(() => tracker.add(target, 'click', null), TypeError, 'null listener');
    assertThrows(() => tracker.add(target, 'click', 'handler'), TypeError, 'string listener');
    assertThrows(() => tracker.add(target, 'click', {}), TypeError, 'object without handleEvent');
  });

  await test('object listeners with handleEvent are accepted', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    const listener = { handleEvent() {} };
    assertEquals(tracker.add(target, 'click', listener), true, 'add result');
    assertEquals(tracker.remove(target, 'click', listener), true, 'remove result');
  });

  await test('invalid options throw TypeError', async () => {
    const tracker = createEventListenerTracker();
    assertThrows(() => tracker.add(createTarget(), 'click', () => {}, 'yes'), TypeError, 'string options');
  });

  await test('native registration failure is not tracked', async () => {
    const tracker = createEventListenerTracker();
    const target = {
      addEventListener() { throw new Error('native failure'); },
      removeEventListener() {},
    };
    assertThrows(() => tracker.add(target, 'click', () => {}), Error, 'native failure');
    assertEquals(tracker.getActiveListeners().length, 0, 'active count');
  });

  await test('duplicate registration does not cause the handler to run twice', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    let calls = 0;
    const handler = () => calls++;

    tracker.add(target, 'click', handler);
    tracker.add(target, 'click', handler);
    target.dispatchEvent(new Event('click'));
    assertEquals(calls, 1, 'handler calls');
  });

  await test('removed history is bounded to the most recent 100 entries', async () => {
    const tracker = createEventListenerTracker();
    const target = createTarget();
    const handlers = Array.from({ length: 105 }, () => () => {});

    handlers.forEach((handler) => tracker.add(target, 'click', handler));
    handlers.forEach((handler) => tracker.remove(target, 'click', handler));
    const removed = tracker.getRemovedListeners();
    assertEquals(removed.length, 100, 'removed count');
    assertEquals(removed[0].listener, handlers[5], 'oldest kept entry');
  });

  await test('removed listeners are recorded by remove() and destroy()', async () => {
    const tracker = createEventListenerTracker();
    const a = createTarget();
    const b = createTarget();
    const handler = () => {};

    tracker.add(a, 'click', handler);
    tracker.add(b, 'click', handler);
    assertEquals(tracker.getRemovedListeners().length, 0, 'removed before remove');
    tracker.remove(a, 'click', handler);
    assertEquals(tracker.getRemovedListeners().length, 1, 'removed after remove');
    assertEquals(tracker.getRemovedListeners()[0].target, a, 'removed target');
    tracker.destroy();
    assertEquals(tracker.getRemovedListeners().length, 2, 'removed after destroy');
    assertEquals(tracker.getActiveListeners().length, 0, 'active after destroy');
  });

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
})();
