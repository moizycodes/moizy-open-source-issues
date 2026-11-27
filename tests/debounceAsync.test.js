const { describe, test, beforeEach, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");

const debounceAsync = require("../utils/debounceAsync");

describe("debounceAsync", () => {
  beforeEach(() => {
    mock.timers.enable({ apis: ["setTimeout"] });
  });

  afterEach(() => {
    mock.timers.reset();
  });

  test("delays a single invocation until the delay has elapsed", async () => {
    const fn = mock.fn(async () => "result");
    const debounced = debounceAsync(fn, 300);

    const result = debounced("value");

    assert.equal(fn.mock.callCount(), 0);
    mock.timers.tick(299);
    assert.equal(fn.mock.callCount(), 0);

    mock.timers.tick(1);
    assert.equal(await result, "result");
    assert.equal(fn.mock.callCount(), 1);
    assert.deepEqual(fn.mock.calls[0].arguments, ["value"]);
  });

  test("resets the timer for rapid consecutive calls", async () => {
    const fn = mock.fn(async () => "latest");
    const debounced = debounceAsync(fn, 300);

    const first = debounced("first");
    mock.timers.tick(200);
    const second = debounced("second");
    mock.timers.tick(200);

    assert.equal(fn.mock.callCount(), 0);

    mock.timers.tick(100);
    assert.deepEqual(await Promise.all([first, second]), ["latest", "latest"]);
    assert.equal(fn.mock.callCount(), 1);
    assert.deepEqual(fn.mock.calls[0].arguments, ["second"]);
  });

  test("uses the latest arguments and context", async () => {
    const fn = mock.fn(function (value) {
      return Promise.resolve({ value, name: this.name });
    });
    const debounced = debounceAsync(fn, 50);
    const firstContext = { name: "first" };
    const latestContext = { name: "latest" };

    const first = debounced.call(firstContext, "old");
    const latest = debounced.call(latestContext, "new");

    mock.timers.tick(50);

    assert.deepEqual(await first, { value: "new", name: "latest" });
    assert.deepEqual(await latest, { value: "new", name: "latest" });
    assert.equal(fn.mock.callCount(), 1);
    assert.deepEqual(fn.mock.calls[0].arguments, ["new"]);
  });

  test("resolves every pending caller with the final invocation result", async () => {
    const debounced = debounceAsync(async value => value * 2, 10);

    const results = [debounced(1), debounced(2), debounced(3)];
    mock.timers.tick(10);

    assert.deepEqual(await Promise.all(results), [6, 6, 6]);
  });

  test("rejects every pending caller when the final invocation rejects", async () => {
    const error = new Error("request failed");
    const fn = mock.fn(async () => {
      throw error;
    });
    const debounced = debounceAsync(fn, 10);

    const first = debounced("old");
    const latest = debounced("new");
    mock.timers.tick(10);

    await Promise.all([
      assert.rejects(first, reason => reason === error),
      assert.rejects(latest, reason => reason === error),
    ]);
    assert.equal(fn.mock.callCount(), 1);
    assert.deepEqual(fn.mock.calls[0].arguments, ["new"]);
  });

  test("converts synchronous exceptions into promise rejections", async () => {
    const error = new Error("synchronous failure");
    const debounced = debounceAsync(() => {
      throw error;
    }, 10);

    const result = debounced();
    mock.timers.tick(10);

    await assert.rejects(result, reason => reason === error);
  });

  test("supports independent debounced functions", async () => {
    const firstFn = mock.fn(async () => "first");
    const secondFn = mock.fn(async () => "second");
    const first = debounceAsync(firstFn, 100);
    const second = debounceAsync(secondFn, 200);

    const firstResult = first();
    const secondResult = second();

    mock.timers.tick(100);
    assert.equal(await firstResult, "first");
    assert.equal(secondFn.mock.callCount(), 0);

    mock.timers.tick(100);
    assert.equal(await secondResult, "second");
    assert.equal(firstFn.mock.callCount(), 1);
    assert.equal(secondFn.mock.callCount(), 1);
  });

  for (const delay of [-1, NaN, Infinity, -Infinity, "100", null, undefined]) {
    test(`rejects invalid delay ${String(delay)}`, () => {
      assert.throws(() => debounceAsync(() => {}, delay), RangeError);
    });
  }

  test("rejects a non-function callback", () => {
    assert.throws(() => debounceAsync(null, 10), TypeError);
  });

  test("supports a zero delay", async () => {
    const debounced = debounceAsync(async () => "ready", 0);
    const result = debounced();

    mock.timers.tick(0);

    assert.equal(await result, "ready");
  });

  test("a later call starts a new independent debounce window", async () => {
    const values = ["first", "second"];
    const fn = mock.fn(async () => values.shift());
    const debounced = debounceAsync(fn, 10);

    const first = debounced("one");
    mock.timers.tick(10);
    assert.equal(await first, "first");

    const second = debounced("two");
    mock.timers.tick(10);
    assert.equal(await second, "second");

    assert.equal(fn.mock.callCount(), 2);
  });
});
