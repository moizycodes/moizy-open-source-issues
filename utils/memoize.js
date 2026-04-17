"use strict";

/**
 * memoize - Caches results of function calls
 * @param {Function} fn
 * @returns {Function}
 */
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  };
}

module.exports = memoize;
