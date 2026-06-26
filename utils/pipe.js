/**
 * Creates a function pipeline that executes functions from left to right.
 *
 * @param {...Function} functions
 * @returns {Function}
 */
function pipe(...functions) {
  const validFunctions = functions.filter((fn) => typeof fn === 'function');

  return (initialValue) => {
    if (validFunctions.length === 0) {
      return initialValue;
    }

    return validFunctions.reduce((result, fn) => {
      return fn(result);
    }, initialValue);
  };
}

module.exports = pipe;