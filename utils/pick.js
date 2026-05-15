/**
 * Extract selected properties from an object.
 *
 * @param {Object} obj
 * @param {Array} keys
 * @returns {Object}
 */

function pick(obj, keys) {
  if (
    obj === null ||
    typeof obj !== 'object' ||
    !Array.isArray(keys)
  ) {
    return {};
  }

  const result = {};

  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

module.exports = pick;