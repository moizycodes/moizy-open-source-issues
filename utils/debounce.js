/**
 * Debounce Utility Function
 * -------------------------
 * Delays the execution of a function until
 * after a certain amount of time has passed
 * since it was last called.
 */

function debounce(fn, delay) {
  let timer;

  const debounced = function (...args) {
    const context = this;

    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };

  /**
   * Cancels the pending call, if there is one.
   */
  debounced.cancel = () => clearTimeout(timer);

  return debounced;
}

module.exports = debounce;
