/**
 * Parses a URL query string and returns an object with key-value pairs.
 * Repeated keys are collected into arrays.
 *
 * @param {string} query - The query string (with or without leading '?')
 * @returns {Object} - An object containing the decoded query parameters.
 *   Repeated keys map to arrays; all others map to strings
 *
 * @example
 * parseQueryParams('?name=moeez&age=22'); // { name: 'moeez', age: '22'}
 * parseQueryParams('?page=1&limit=10');   // { page: '1', age: '10'}
 * parseQueryParams('?tag=js&tag=node');   // { tag: ['js', 'node']}
 * parseQueryParams('');                   // {}
 * parseQueryParams(null);                 // {}
 */

export function parseQueryParams(query) {
  if (!query || typeof query !== 'string') return {};

  const params = new URLSearchParams(query);
  const result = {};

  for (const key of params.keys()) {
    const values = params.getAll(key);
    result[key] = values.length === 1 ? values[0] : values;
  }

  return result;
}

// console.log(parseQueryParams(null));
// console.log(new URLSearchParams(null));
console.log(parseQueryParams('?tag=js&tag=node'));
console.log(parseQueryParams('?tag=js'));
// console.log(parseQueryParams(3));
