const test = require("node:test");
const assert = require("node:assert/strict");

const sleep = require("../utils/sleep.js");

// Fake timers keep these tests exact. Measuring real elapsed time fails now
// and then, because a 100ms timer can fire after 99ms on the clock.
const trackSettled = (promise) => {
  const state = { settled: false };
  promise.then(() => {
    state.settled = true;
  });
  return state;
};

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

test("sleep resolves after delay", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const state = trackSettled(sleep(100));

  t.mock.timers.tick(99);
  await flushPromises();
  assert.equal(state.settled, false);

  t.mock.timers.tick(1);
  await flushPromises();
  assert.equal(state.settled, true);
});

test("sleep handles zero delay", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const state = trackSettled(sleep(0));

  t.mock.timers.tick(0);
  await flushPromises();
  assert.equal(state.settled, true);
});

test("sleep handles negative delay", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const state = trackSettled(sleep(-100));

  t.mock.timers.tick(0);
  await flushPromises();
  assert.equal(state.settled, true);
});

test("sleep handles non-number input", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const state = trackSettled(sleep("invalid"));

  t.mock.timers.tick(0);
  await flushPromises();
  assert.equal(state.settled, true);
});
