/**
 * Lightweight EventEmitter.
 * Allows registering, emitting, removing, and clearing event listeners.
 */
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * Register a listener for an event.
   *
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push(callback);
  }

  /**
   * Emit an event and pass arguments to each listener.
   *
   * @param {string} event
   * @param {...*} args
   */
  emit(event, ...args) {
    if (!this.events.has(event)) {
      return;
    }

    const listeners = this.events.get(event);

    listeners.forEach((callback) => {
      callback(...args);
    });
  }

  /**
   * Remove a specific listener from an event.
   *
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (!this.events.has(event)) {
      return;
    }

    const listeners = this.events.get(event).filter(
      (listener) => listener !== callback
    );

    if (listeners.length === 0) {
      this.events.delete(event);
      return;
    }

    this.events.set(event, listeners);
  }

  /**
   * Register a listener that runs only once.
   *
   * @param {string} event
   * @param {Function} callback
   */
  once(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }

  /**
   * Return all listeners for an event.
   *
   * @param {string} event
   * @returns {Function[]}
   */
  listeners(event) {
    if (!this.events.has(event)) {
      return [];
    }

    return [...this.events.get(event)];
  }

  /**
   * Clear listeners for one event or all events.
   *
   * @param {string} event
   */
  clear(event) {
    if (event) {
      this.events.delete(event);
      return;
    }

    this.events.clear();
  }
}

module.exports = EventEmitter;