/**
 * storageManager - A safe, reusable localStorage utility.
 *
 * Automatically serializes/deserializes values via JSON and handles
 * all localStorage errors gracefully without crashing the application.
 *
 * @example
 * storageManager.set('user', { name: 'Moeez' });
 * const user = storageManager.get('user');
 * storageManager.remove('user');
 * storageManager.clear();
 */

/**
 * Validates that a key is a non-empty string.
 * @param {*} key
 * @throws {TypeError} if key is not a non-empty string
 */
const assertKey = (key) => {
  if (typeof key !== 'string' || key.trim() === '') {
    throw new TypeError('storageManager: key must be a non-empty string');
  }
};

/**
 * Returns true if localStorage is available in the current environment.
 * @returns {boolean}
 */
const isAvailable = () => {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
};

const storageManager = {
  /**
   * Serializes and stores a value under the given key.
   * Silently fails if localStorage is unavailable or quota is exceeded.
   *
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    assertKey(key);
    if (!isAvailable()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or other storage error — fail gracefully
    }
  },

  /**
   * Retrieves and deserializes the value stored under the given key.
   * Returns defaultValue if the key is missing or the stored JSON is invalid.
   *
   * @param {string} key
   * @param {*} [defaultValue=null]
   * @returns {*}
   */
  get(key, defaultValue = null) {
    assertKey(key);
    if (!isAvailable()) return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      // Return a deep copy to avoid mutating the parsed object externally
      return JSON.parse(JSON.stringify(JSON.parse(raw)));
    } catch {
      // Invalid JSON already in storage — return safe default
      return defaultValue;
    }
  },

  /**
   * Removes the item stored under the given key.
   *
   * @param {string} key
   */
  remove(key) {
    assertKey(key);
    if (!isAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Fail gracefully
    }
  },

  /**
   * Clears all items from localStorage.
   */
  clear() {
    if (!isAvailable()) return;
    try {
      localStorage.clear();
    } catch {
      // Fail gracefully
    }
  },
};

export { storageManager };
