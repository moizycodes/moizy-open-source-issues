/**
 * Wraps a promise with a timeout.
 *
 * Returns a promise that resolves or rejects with the original promise.
 * If the original promise does not settle within the specified timeout,
 * the returned promise rejects with a timeout error.
 *
 * @param {Promise<any>} promise - The promise to wrap.
 * @param {number} timeout - The timeout duration in milliseconds.
 * @returns {Promise<any>} A promise that resolves with the original promise's value or rejects if the timeout is exceeded.
 *
 * @example
 * const result = await withTimeout(fetch("/api/users"), 5000);
 *
 * @example
 * await withTimeout(
 *   new Promise(resolve => setTimeout(resolve, 1000)),
 *   2000
 * );
 */
function withTimeout(promise, timeout) {
  if (!promise || typeof promise.then !== 'function') {
    return Promise.reject(new Error('Invalid promise provided'));
  }
  if (timeout <= 0) {
    return Promise.reject(new RangeError('Timeout must be greater than 0'));
  }

  let timerId;

  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeout} ms`));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise])
    .finally(() => {
      clearTimeout(timerId);
    });
}

export { withTimeout };