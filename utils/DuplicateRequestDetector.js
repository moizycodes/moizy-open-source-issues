'use strict';

/**
 * Duplicate Request Detector
 *
 * Detects and blocks duplicate requests based on a unique request identifier
 * and a configurable time-to-live (TTL) window. Useful for preventing double
 * payments, duplicate form submissions, and repeated API calls.
 *
 * @example
 * const DuplicateRequestDetector = require('./utils/DuplicateRequestDetector');
 *
 * const detector = new DuplicateRequestDetector({ ttl: 5000 });
 *
 * if (detector.isDuplicate(orderId)) {
 *   throw new Error('Duplicate request detected');
 * }
 *
 * processOrder();
 */
class DuplicateRequestDetector {
  /**
   * @param {Object} [options={}]
   * @param {number} [options.ttl] - Time window in milliseconds during which
   *   repeat identifiers are treated as duplicates. When omitted, entries do
   *   not expire until {@link DuplicateRequestDetector#clear} is called.
   */
  constructor(options = {}) {
    const ttl = options.ttl;

    this.ttl =
      typeof ttl === 'number' && ttl > 0 ? ttl : null;

    /** @type {Map<string, number|null>} */
    this.entries = new Map();
  }

  /**
   * Checks whether a request identifier has already been seen within the TTL window.
   *
   * The first call for an identifier returns `false` (not a duplicate) and records
   * the identifier. Subsequent calls with the same identifier return `true` until
   * the entry expires or {@link DuplicateRequestDetector#clear} is invoked.
   *
   * @param {string|number} requestId - Unique identifier for the request
   * @returns {boolean} `true` if the request is a duplicate, otherwise `false`
   */
  isDuplicate(requestId) {
    if (!this.isValidRequestId(requestId)) {
      return false;
    }

    this.removeExpiredEntries();

    const key = String(requestId);
    const now = Date.now();

    if (this.entries.has(key)) {
      const expiresAt = this.entries.get(key);

      if (expiresAt === null || now < expiresAt) {
        return true;
      }

      this.entries.delete(key);
    }

    const expiresAt = this.ttl !== null ? now + this.ttl : null;
    this.entries.set(key, expiresAt);

    return false;
  }

  /**
   * Removes all tracked request identifiers.
   */
  clear() {
    this.entries.clear();
  }

  /**
   * Returns the number of active (non-expired) tracked identifiers.
   *
   * @returns {number}
   */
  size() {
    this.removeExpiredEntries();
    return this.entries.size;
  }

  /**
   * @param {*} requestId
   * @returns {boolean}
   */
  isValidRequestId(requestId) {
    if (requestId === null || requestId === undefined) {
      return false;
    }

    if (typeof requestId !== 'string' && typeof requestId !== 'number') {
      return false;
    }

    if (typeof requestId === 'string' && requestId.trim() === '') {
      return false;
    }

    return true;
  }

  /**
   * Deletes expired entries to prevent unbounded memory growth.
   */
  removeExpiredEntries() {
    if (this.ttl === null) {
      return;
    }

    const now = Date.now();

    for (const [key, expiresAt] of this.entries) {
      if (expiresAt !== null && now >= expiresAt) {
        this.entries.delete(key);
      }
    }
  }
}

module.exports = DuplicateRequestDetector;
