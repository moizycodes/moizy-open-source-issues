/**
 * Creates a version of the function that only execites once
 * @param {Function} func - The function to execute only once 
 * @returns {Function} - New function that executes func only on first call 
 */

function once(func) {
  // Track if the function has been called
  let called = false;

  // Store the result from the first execution
  let result;

  // Return a new function that wraps the original 
  return function (...args) {
    // Only execute if not yet called 
    if (!called) {
      // Mark as called to prevent future executions
      called = true;

      //Execute original function preserving context (this) and arguments
      result = func.apply(this, args);
    }

    // Return cached result (from frist call or current execution)
    return result;
  };
}

module.exports = once;