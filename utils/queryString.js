/**
 * Parse a URL query string into an object.
 *
 * @param {string} query
 * @returns {Object}
 */
function parseQuery(query) {
  if (typeof query !== 'string' || query.length === 0) {
    return {};
  }

  const queryString = query.startsWith('?') ? query.slice(1) : query;

  if (queryString.length === 0) {
    return {};
  }

  return queryString.split('&').reduce((result, pair) => {
    if (pair.length === 0) {
      return result;
    }

    const [rawKey, rawValue = ''] = pair.split('=');

    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue);

    result[key] = value;

    return result;
  }, {});
}

/**
 * Convert an object into a URL query string.
 *
 * @param {Object} obj
 * @returns {string}
 */
function stringifyQuery(obj) {
  if (
    obj === null ||
    typeof obj !== 'object' ||
    Array.isArray(obj)
  ) {
    return '';
  }

  const entries = Object.entries(obj);

  if (entries.length === 0) {
    return '';
  }

  const query = entries.map(([key, value]) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(String(value));

    return `${encodedKey}=${encodedValue}`;
  }).join('&');

  return `?${query}`;
}

module.exports = {
  parseQuery,
  stringifyQuery
};