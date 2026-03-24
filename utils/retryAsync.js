/**
 * Helper function to create delay
 * @param {number} ms
 * @returns {Promise<void>}
 */
const wait = (ms)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve,ms);
    })
}
/**
 * retryAsync utility function
 * @param {Function} asyncFn
 * @param {Object} options
 * @param {number} options.retries
 * @param {number} options.delay
 * @param {boolean} options.backoff
 */
const retryAsync = async (asyncFn, options = {}) => {
  const {
    retries = 3,
    delay = 1000,
    backoff = false
  } = options;

  // validation
  if (typeof asyncFn !== 'function') {
    throw new TypeError('asyncFn must be a function');
  }

  if (typeof retries !== 'number' || retries < 0) {
    throw new TypeError('retries must be a non-negative number');
  }

  if (typeof delay !== 'number' || delay < 0) {
    throw new TypeError('delay must be a non-negative number');
  }

  let attempt = 0;

  while (attempt <= retries) {
    try {
      return await asyncFn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      const waitTime = backoff
        ? delay * Math.pow(2, attempt)
        : delay;

      await wait(waitTime);
      attempt++;
    }
  }
};

export default retryAsync;