/**
 * Recursively freezes an object and all its nested objects/arrays.
 *
 * This utility prevents mutations on deeply nested properties while handling
 * edge cases like null values, circular references, and already frozen objects.
 * Returns the original frozen object (no copy is made).
 *
 * @param {*} obj - The object to freeze (can be any type).
 * @returns {*} The frozen object (or the input unchanged if not an object).
 *
 * @example
 * const config = {
 *   api: {
 *     baseUrl: '/api'
 *   }
 * };
 *
 * deepFreeze(config);
 *
 * config.api.baseUrl = '/new-api'; // fails silently in non-strict mode
 *
 * @example <caption>Freezes arrays inside objects</caption>
 * const data = {
 *   users: [{ name: 'Moeez' }, { name: 'Alice' }]
 * };
 *
 * deepFreeze(data);
 *
 * data.users[0].name = 'Bob'; // fails silently in non-strict mode
 */
function deepFreeze(obj) {
  return _freeze(obj, new WeakSet());
}

/**
 * Internal recursive helper that carries a cache of already-frozen objects.
 *
 * @param {*} obj - The value being frozen at this recursion level.
 * @param {WeakSet} seen - Set of already-frozen objects to prevent infinite loops.
 * @returns {*} The frozen value (or original if not an object).
 */
function _freeze(obj, seen) {
  // Primitives and null are immutable / value types — return as-is.
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // If already frozen or already seen in this call stack, return it.
  // This handles circular references and already frozen objects.
  if (Object.isFrozen(obj) || seen.has(obj)) {
    return obj;
  }

  // Mark as seen to prevent infinite recursion with circular references.
  seen.add(obj);

  // Freeze all properties recursively.
  const props = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    const value = obj[prop];

    // Recursively freeze nested objects/arrays.
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      _freeze(value, seen);
    }
  }

  // Freeze the object itself.
  return Object.freeze(obj);
}

module.exports = deepFreeze;
