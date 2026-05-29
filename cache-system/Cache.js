/**
 * Lightweight in-memory cache with optional TTL support.
 */
class Cache {
  constructor() {
    this.store = new Map();
  }

  /**
   * Store a value by key with optional time-to-live.
   *
   * @param {string} key
   * @param {*} value
   * @param {number} ttl Time to live in milliseconds
   */
  set(key, value, ttl) {
    const expiresAt = this.getExpirationTime(ttl);

    this.store.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Retrieve a cached value by key.
   *
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    if (!this.store.has(key)) {
      return undefined;
    }

    const item = this.store.get(key);

    if (this.isExpired(item)) {
      this.store.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Check if a key exists and has not expired.
   *
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    if (!this.store.has(key)) {
      return false;
    }

    const item = this.store.get(key);

    if (this.isExpired(item)) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete a cached item.
   *
   * @param {string} key
   * @returns {boolean}
   */
  delete(key) {
    return this.store.delete(key);
  }

  /**
   * Clear all cached items.
   */
  clear() {
    this.store.clear();
  }

  /**
   * Return number of active cache items.
   *
   * @returns {number}
   */
  size() {
    this.removeExpiredItems();
    return this.store.size;
  }

  /**
   * Calculate expiration timestamp.
   *
   * @param {number} ttl
   * @returns {number|null}
   */
  getExpirationTime(ttl) {
    if (
      typeof ttl !== 'number' ||
      ttl <= 0
    ) {
      return null;
    }

    return Date.now() + ttl;
  }

  /**
   * Check whether a cache item is expired.
   *
   * @param {Object} item
   * @returns {boolean}
   */
  isExpired(item) {
    return (
      item.expiresAt !== null &&
      Date.now() > item.expiresAt
    );
  }

  /**
   * Remove all expired cache entries.
   */
  removeExpiredItems() {
    this.store.forEach((item, key) => {
      if (this.isExpired(item)) {
        this.store.delete(key);
      }
    });
  }
}

module.exports = Cache;