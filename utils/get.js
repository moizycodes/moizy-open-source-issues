/**
 * Safely retrieves a nested value from an object using a string or array path.
 *
 * @param {Object} obj
 * @param {string|string[]} path
 * @param {*} defaultValue
 * @returns {*}
 */
function get(obj, path, defaultValue) {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return defaultValue;
  }

  if (path === '' || path === null || path === undefined) {
    return defaultValue;
  }

  const keys = Array.isArray(path)
    ? path
    : String(path).split('.');

  const result = keys.reduce((currentValue, key) => {
    if (currentValue === null || currentValue === undefined) {
      return undefined;
    }

    return currentValue[key];
  }, obj);

  return result === undefined ? defaultValue : result;
}

module.exports = get;