'use strict';

/**
 * Creates a tracker that records event listeners registered through it so
 * they can be inspected, removed individually, or cleaned up together.
 *
 * The tracker never patches native APIs and never scans the DOM: it only
 * knows about the listeners that were added via `add()`.
 *
 * @returns {{
 *   add: (target: object, type: string, listener: Function|object, options?: boolean|object) => boolean,
 *   remove: (target: object, type: string, listener: Function|object, options?: boolean|object) => boolean,
 *   getActiveListeners: () => Array<object>,
 *   getRemovedListeners: () => Array<object>,
 *   destroy: () => void
 * }}
 */
const createEventListenerTracker = () => {
  // Maximum number of removed entries kept for getRemovedListeners(). Older entries are dropped
  // so the tracker does not hold references to targets and listeners for its whole lifetime.
  const MAX_REMOVED = 100;

  // Each entry: { target, type, listener, capture, options }
  let entries = [];
  // Metadata of recently removed listeners (by remove() or destroy()), oldest first.
  let removed = [];
  let destroyed = false;

  const isCapture = (options) => {
    if (typeof options === 'boolean') return options;
    if (options && typeof options === 'object') return Boolean(options.capture);
    return false;
  };

  const validateTarget = (target) => {
    if (target === null || target === undefined || typeof target.addEventListener !== 'function' ||
        typeof target.removeEventListener !== 'function') {
      throw new TypeError('target must be an event target with addEventListener and removeEventListener');
    }
  };

  const validateType = (type) => {
    if (typeof type !== 'string' || type.trim() === '') {
      throw new TypeError('event type must be a non-empty string');
    }
  };

  const validateListener = (listener) => {
    const isFunction = typeof listener === 'function';
    const isHandlerObject = listener !== null && typeof listener === 'object' &&
      typeof listener.handleEvent === 'function';
    if (!isFunction && !isHandlerObject) {
      throw new TypeError('listener must be a function or an object with a handleEvent method');
    }
  };

  const validateOptions = (options) => {
    const type = typeof options;
    if (options !== undefined && options !== null && type !== 'boolean' && type !== 'object') {
      throw new TypeError('options must be a boolean, an object, null, or undefined');
    }
  };

  const validateArgs = (target, type, listener, options) => {
    validateTarget(target);
    validateType(type);
    validateListener(listener);
    validateOptions(options);
  };

  const findIndex = (target, type, listener, capture) =>
    entries.findIndex((entry) =>
      entry.target === target &&
      entry.type === type &&
      entry.listener === listener &&
      entry.capture === capture
    );

  const toMetadata = (entry) => ({
    target: entry.target,
    type: entry.type,
    listener: entry.listener,
    capture: entry.capture,
    options: entry.options,
  });

  const recordRemoved = (entry) => {
    removed.push(toMetadata(entry));
    if (removed.length > MAX_REMOVED) {
      removed.splice(0, removed.length - MAX_REMOVED);
    }
  };

  /**
   * Registers a listener and tracks it.
   * @returns {boolean} true if registered, false if the same
   *   target/type/listener/capture combination was already tracked.
   */
  const add = (target, type, listener, options) => {
    if (destroyed) {
      throw new Error('Cannot add listeners after the tracker has been destroyed');
    }
    validateArgs(target, type, listener, options);

    const capture = isCapture(options);
    if (findIndex(target, type, listener, capture) !== -1) {
      return false;
    }

    const entry = {
      target,
      type,
      listener,
      capture,
      options: options && typeof options === 'object' ? { ...options } : options,
    };

    // Native registration throws on invalid arguments; nothing is tracked in that case.
    target.addEventListener(type, listener, options);

    entries.push(entry);
    return true;
  };

  const nativeRemove = (entry) => {
    entry.target.removeEventListener(entry.type, entry.listener, entry.capture);
  };

  /**
   * Removes a tracked listener.
   * @returns {boolean} true if a tracked listener was removed, false if it was not tracked.
   */
  const remove = (target, type, listener, options) => {
    validateArgs(target, type, listener, options);

    const capture = isCapture(options);
    const index = findIndex(target, type, listener, capture);
    if (index === -1) {
      return false;
    }

    const [entry] = entries.splice(index, 1);
    nativeRemove(entry);
    recordRemoved(entry);
    return true;
  };

  /**
   * @returns {Array<{target, type, listener, capture, options}>} copies of active entries.
   */
  const getActiveListeners = () => entries.map(toMetadata);

  /**
   * @returns {Array<{target, type, listener, capture, options}>} copies of the most recent
   *   removed entries (up to MAX_REMOVED), removed by remove() or destroy().
   */
  const getRemovedListeners = () => removed.map(toMetadata);

  /**
   * Removes every tracked listener and prevents further registrations.
   * Safe to call more than once.
   */
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    const current = entries;
    entries = [];
    current.forEach((entry) => {
      nativeRemove(entry);
      recordRemoved(entry);
    });
  };

  return { add, remove, getActiveListeners, getRemovedListeners, destroy };
};

module.exports = createEventListenerTracker;
