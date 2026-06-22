/**
 * Flattens a nested object into a single-level object using dot notation.
 *
 * @param {Object} obj
 * @param {string} prefix
 * @returns {Object}
 */
function flattenObject(obj, prefix = '') {
  if (
    obj === null ||
    typeof obj !== 'object' ||
    Array.isArray(obj)
  ) {
    return {};
  }

  return Object.keys(obj).reduce((result, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      return {
        ...result,
        ...flattenObject(value, newKey)
      };
    }

    return {
      ...result,
      [newKey]: value
    };
  }, {});
}

module.exports = flattenObject;