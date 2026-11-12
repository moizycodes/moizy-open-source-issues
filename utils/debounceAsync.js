function debounceAsync(fn, delay) {
  if (typeof fn !== "function") {
    throw new TypeError("Expected fn to be a function");
  }

  if (typeof delay !== "number" || !Number.isFinite(delay) || delay < 0) {
    throw new RangeError("Expected delay to be a finite, non-negative number");
  }

  let timer;
  let pending = [];

  return function (...args) {
    const context = this;

    clearTimeout(timer);

    const promise = new Promise((resolve, reject) => {
      pending.push({ resolve, reject });
    });

    timer = setTimeout(async () => {
      const current = pending;
      pending = [];

      try {
        const result = await fn.apply(context, args);
        current.forEach(({ resolve }) => resolve(result));
      } catch (error) {
        current.forEach(({ reject }) => reject(error));
      }
    }, delay);

    return promise;
  };
}

module.exports = debounceAsync;
