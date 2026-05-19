/**
 * Creates a new object excluding specified keys.
 *
 * @param {Object} obj
 * @param {Array} keys
 * @returns {Object}
 */
function omit(obj, keys) {
  if (
    obj === null ||
    typeof obj !== 'object' ||
    !Array.isArray(keys)
  ) {
    return {};
  }

  const result = {};

  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

module.exports = omit;