/**
 * Both pipe and compose are higher-order functions that take a series of
 * functions as arguments and return a new function that applies those
 * functions in a specific order.
 *
 * @param  {...any} fns - Functions to apply
 * @returns {Function} A new function that applies the provided functions in order
 *
 * @example
 * // pipe applies functions from left to right.
 * // `pipe(f1, f2, f3)(x)` is equivalent to `f3(f2(f1(x)))`.
 *
 * // compose applies functions from right to left.
 * // `compose(f1, f2, f3)(x)` is equivalent to `f1(f2(f3(x)))`.
 *
 * // If no functions are provided, both pipe and compose return an identity function
 * pipe()(5); // 5
 * compose()(5); // 5
 *
 * // Non-function arguments throw a TypeError at construction time
 * pipe(3, add, double); // throws TypeError: pipe: argument at index 0 is not a function, got number
 */

function pipe(...fns) {
  fns.forEach((f, i) => {
    if (typeof f !== "function")
      throw new TypeError(
        `pipe: argument at index ${i} is not a function, got ${typeof f}`,
      );
  });

  if (fns.length === 0) return (x) => x;

  return (x) => fns.reduce((v, f) => f(v), x);
}

function compose(...fns) {
  fns.forEach((f, i) => {
    if (typeof f !== "function")
      throw new TypeError(
        `compose: argument at index ${i} is not a function, got ${typeof f}`,
      );
  });

  if (fns.length === 0) return (x) => x;

  return (x) => fns.reduceRight((v, f) => f(v), x);
}

module.exports = {pipe, compose};
