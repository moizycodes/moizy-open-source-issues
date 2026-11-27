/**
 * Groups an array of items by a key or callback function.
 *
 * @param {Array} array
 * @param {string|Function} keyOrFn
 * @returns {Object}
 */
function groupBy(array, keyOrFn) {
  if (!Array.isArray(array)) {
    return {};
  }

  const isValidKey = ['string', 'number', 'boolean', 'symbol'].includes(typeof keyOrFn);
  if (!isValidKey && typeof keyOrFn !== 'function') {
    return {};
  }

  return array.reduce((result, item) => {
    const groupKey = typeof keyOrFn === 'function'
      ? keyOrFn(item)
      : item && item[keyOrFn];

    const normalizedKey = String(groupKey);

    if (!Object.prototype.hasOwnProperty.call(result, normalizedKey)) {
      // defineProperty keeps a '__proto__' group as a normal key instead of replacing the result's prototype.
      Object.defineProperty(result, normalizedKey, {
        value: [],
        writable: true,
        enumerable: true,
        configurable: true
      });
    }

    result[normalizedKey].push(item);

    return result;
  }, {});
}

module.exports = groupBy;