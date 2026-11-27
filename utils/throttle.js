/**
 * Throttle utility function
 * Limits how frequently a function can be called
 * 
 * @param {Function} fn - The function to throttle
 * @param {number} delay - The delay in milliseconds between executions
 * @param {Object} options - Configuration options
 * @param {boolean} options.leading - Execute on leading edge (default: true)
 * @param {boolean} options.trailing - Execute on trailing edge (default: true)
 * @returns {Function} - A throttled version of the input function
 * 
 * Features:
 * - Executes immediately on first call (leading edge)
 * - Executes the last call after delay (trailing edge)
 * - Prevents execution until the delay period passes
 * - Preserves 'this' context and arguments
 * - Returns the result of function execution
 * - Configurable leading/trailing behavior
 * 
 * Example usage:
 * ```javascript
 * // Basic throttle
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event handled');
 * }, 200);
 * 
 * // With options
 * const leadingOnly = throttle(fn, 1000, { leading: true, trailing: false });
 * 
 * // With context preservation
 * window.addEventListener('resize', throttle(this.handleResize.bind(this), 250));
 * ```
 */
function throttle(fn, delay, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError('throttle: first argument must be a function');
  }
  if (typeof delay !== 'number' || isNaN(delay)) {
    throw new TypeError('throttle: delay must be a valid number');
  }

  const { leading = true, trailing = true } = options;
  let timeoutId = null;
  let lastCallTime = 0;
  let lastArgs = null;
  let lastContext = null;
  let lastResult;

  // Execute the function and update state
  const execute = (context, args) => {
    lastCallTime = Date.now();
    lastResult = fn.apply(context, args);
    return lastResult;
  };

  // Schedule trailing execution
  const scheduleTrailing = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing && lastArgs) {
        execute(lastContext, lastArgs);
        lastArgs = null;
        lastContext = null;
      }
    }, Math.max(0, delay - (Date.now() - lastCallTime)));
  };

  // Return the throttled function
  return function throttled(...args) {
    const currentTime = Date.now();
    const timeSinceLastCall = currentTime - lastCallTime;
    const shouldExecuteLeading = leading && lastCallTime === 0;

    // Store context and args for potential trailing execution
    if (trailing) {
      lastArgs = args;
      lastContext = this;
    }

    // If this is the first call and leading is enabled, execute immediately
    if (shouldExecuteLeading) {
      return execute(this, args);
    }

    // If not currently throttling (lastCallTime !== 0 prevents leading: false from firing on first call)
    if (timeSinceLastCall >= delay && timeoutId === null && lastCallTime !== 0) {
      return execute(this, args);
    }

    // If throttling and trailing is enabled, schedule execution
    if (trailing) {
      scheduleTrailing();
    }

    // Return last result for immediate feedback
    return lastResult;
  };
}

module.exports = throttle;
