/**
 * Debounce Utility Function
 * -------------------------
 * Delays the execution of a function until
 * after a certain amount of time has passed
 * since it was last called.
 */

function debounce(fn, delay) {
  let timer;

  return function (...args) {
    const context = this;

    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

module.exports = debounce;