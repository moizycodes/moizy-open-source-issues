/**
 * rateLimit - Restricts how many times a function can be called within an interval
 *
 * @param {Function} fn - The function to rate limit
 * @param {Object} config - Configuration object
 * @param {number} config.limit - Max number of calls allowed per interval
 * @param {number} config.interval - Time window in milliseconds
 * @returns {Function} - A rate-limited version of the input function
 *
 * @example
 * const limitedFn = rateLimit(apiCall, { limit: 3, interval: 1000 });
 * limitedFn(); // allowed
 * limitedFn(); // allowed
 * limitedFn(); // allowed
 * limitedFn(); // throws Error('Rate limit exceeded')
 */
export function rateLimit(fn, config) {
  if (typeof fn !== 'function') {
    throw new TypeError('rateLimit: first argument must be a function');
  }

  if (!config || typeof config !== 'object') {
    throw new TypeError('rateLimit: second argument must be a config object');
  }

  const { limit, interval } = config;

  if (typeof limit !== 'number' || limit <= 0) {
    throw new RangeError('rateLimit: limit must be a number greater than 0');
  }

  if (typeof interval !== 'number' || interval <= 0) {
    throw new RangeError('rateLimit: interval must be a number greater than 0');
  }

  let callCount = 0;
  let windowStart = Date.now();

  return function rateLimited(...args) {
    const now = Date.now();

    // Reset counter if the interval window has passed
    if (now - windowStart >= interval) {
      callCount = 0;
      windowStart = now;
    }

    if (callCount >= limit) {
      throw new Error('Rate limit exceeded');
    }

    callCount++;
    return fn.apply(this, args);
  };
}
