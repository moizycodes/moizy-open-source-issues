/**
 * Creates a completely independent deep copy of any value.
 *
 * Handles plain objects, arrays, nested structures, and all primitives
 * (string, number, boolean, null, undefined). Circular references are
 * detected and preserved in the clone (e.g. if obj.self === obj, then
 * clone.self === clone).
 *
 * @param {*} value - The value to clone.
 * @returns {*} A deep clone of the input value.
 *
 * @example
 * const user = { name: "Alice", preferences: { theme: "dark" } };
 * const cloned = deepClone(user);
 * cloned.preferences.theme = "light";
 * console.log(user.preferences.theme); // "dark"
 *
 * @example <caption>Circular references are handled gracefully</caption>
 * const obj = {};
 * obj.self = obj;
 * const cloned = deepClone(obj);
 * console.log(cloned.self === cloned); // true
 */
function deepClone(value) {
    return _clone(value, new WeakMap());
}

/**
 * Internal recursive helper that carries a cache of already-cloned objects.
 *
 * @param {*} value - The value being cloned at this recursion level.
 * @param {WeakMap} seen - Maps original objects to their in-progress clones,
 *   enabling circular reference detection.
 * @returns {*} The cloned value.
 */
function _clone(value, seen) {
    // Primitives and null are immutable / value types — return as-is.
    if (value === null || typeof value !== 'object') {
        return value;
    }

    // If we have already started cloning this object, return the in-progress
    // clone. This handles both circular references and shared sub-objects.
    if (seen.has(value)) {
        return seen.get(value);
    }

    if (Array.isArray(value)) {
        const arr = [];
        // Register before recursing so circular back-references resolve correctly.
        seen.set(value, arr);
        for (let i = 0; i < value.length; i++) {
            arr[i] = _clone(value[i], seen);
        }
        return arr;
    }

    const clone = {};
    // Register before recursing so circular back-references resolve correctly.
    seen.set(value, clone);
    for (const key of Object.keys(value)) {
        clone[key] = _clone(value[key], seen);
    }

    return clone;
}

module.exports = deepClone;