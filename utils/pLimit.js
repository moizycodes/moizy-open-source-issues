/**
 * Create a concurrency limiter for async or sync tasks.
 *
 * @param {number} concurrency Maximum number of tasks running at once.
 * @returns {Function} Function used to schedule limited tasks.
 */
function pLimit(concurrency) {
  if (
    !Number.isInteger(concurrency) ||
    concurrency < 1
  ) {
    throw new Error('Concurrency must be a positive integer');
  }

  const queue = [];
  let activeCount = 0;

  const next = () => {
    if (activeCount >= concurrency || queue.length === 0) {
      return;
    }

    const task = queue.shift();
    activeCount += 1;

    Promise.resolve()
      .then(task.fn)
      .then(task.resolve)
      .catch(task.reject)
      .finally(() => {
        activeCount -= 1;
        next();
      });
  };

  return function limit(fn) {
    if (typeof fn !== 'function') {
      return Promise.reject(new Error('Task must be a function'));
    }

    return new Promise((resolve, reject) => {
      queue.push({
        fn,
        resolve,
        reject
      });

      next();
    });
  };
}

module.exports = pLimit;