const debounceAsync = require("../utils/debounceAsync");

describe("debounceAsync", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("delays a single invocation until the delay has elapsed", async () => {
    const fn = jest.fn().mockResolvedValue("result");
    const debounced = debounceAsync(fn, 300);

    const result = debounced("value");

    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    await expect(result).resolves.toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("value");
  });

  test("resets the timer for rapid consecutive calls", async () => {
    const fn = jest.fn().mockResolvedValue("latest");
    const debounced = debounceAsync(fn, 300);

    const first = debounced("first");
    jest.advanceTimersByTime(200);
    const second = debounced("second");
    jest.advanceTimersByTime(200);

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    await expect(Promise.all([first, second])).resolves.toEqual(["latest", "latest"]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("second");
  });

  test("uses the latest arguments and context", async () => {
    const fn = jest.fn(function (value) {
      return Promise.resolve({ value, name: this.name });
    });
    const debounced = debounceAsync(fn, 50);
    const firstContext = { name: "first" };
    const latestContext = { name: "latest" };

    const first = debounced.call(firstContext, "old");
    const latest = debounced.call(latestContext, "new");

    jest.advanceTimersByTime(50);

    await expect(first).resolves.toEqual({ value: "new", name: "latest" });
    await expect(latest).resolves.toEqual({ value: "new", name: "latest" });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("new");
  });

  test("resolves every pending caller with the final invocation result", async () => {
    const debounced = debounceAsync(async value => value * 2, 10);

    const results = [debounced(1), debounced(2), debounced(3)];
    jest.advanceTimersByTime(10);

    await expect(Promise.all(results)).resolves.toEqual([6, 6, 6]);
  });

  test("rejects every pending caller when the final invocation rejects", async () => {
    const error = new Error("request failed");
    const fn = jest.fn().mockRejectedValue(error);
    const debounced = debounceAsync(fn, 10);

    const first = debounced("old");
    const latest = debounced("new");
    jest.advanceTimersByTime(10);

    await expect(first).rejects.toBe(error);
    await expect(latest).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("new");
  });

  test("converts synchronous exceptions into promise rejections", async () => {
    const error = new Error("synchronous failure");
    const debounced = debounceAsync(() => {
      throw error;
    }, 10);

    const result = debounced();
    jest.advanceTimersByTime(10);

    await expect(result).rejects.toBe(error);
  });

  test("supports independent debounced functions", async () => {
    const firstFn = jest.fn().mockResolvedValue("first");
    const secondFn = jest.fn().mockResolvedValue("second");
    const first = debounceAsync(firstFn, 100);
    const second = debounceAsync(secondFn, 200);

    const firstResult = first();
    const secondResult = second();

    jest.advanceTimersByTime(100);
    await expect(firstResult).resolves.toBe("first");
    expect(secondFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    await expect(secondResult).resolves.toBe("second");
    expect(firstFn).toHaveBeenCalledTimes(1);
    expect(secondFn).toHaveBeenCalledTimes(1);
  });

  test.each([-1, NaN, Infinity, -Infinity, "100", null, undefined])(
    "rejects invalid delay %s",
    delay => {
      expect(() => debounceAsync(jest.fn(), delay)).toThrow(RangeError);
    }
  );

  test("rejects a non-function callback", () => {
    expect(() => debounceAsync(null, 10)).toThrow(TypeError);
  });

  test("supports a zero delay", async () => {
    const debounced = debounceAsync(async () => "ready", 0);
    const result = debounced();

    jest.advanceTimersByTime(0);

    await expect(result).resolves.toBe("ready");
  });

  test("a later call starts a new independent debounce window", async () => {
    const fn = jest.fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");
    const debounced = debounceAsync(fn, 10);

    const first = debounced("one");
    jest.advanceTimersByTime(10);
    await expect(first).resolves.toBe("first");

    const second = debounced("two");
    jest.advanceTimersByTime(10);
    await expect(second).resolves.toBe("second");

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
