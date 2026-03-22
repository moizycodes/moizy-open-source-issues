/**
 * Wait for a given amount of milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retries an async function with configurable behavior
 *
 * @param {Function} asyncFn
 * @param {Object} options
 * @param {number} options.retries
 * @param {number} options.delay
 * @param {boolean} [options.backoff=false]
 *
 * @returns {Promise<any>}
 */

export async function retryAsync(asyncFn, options = {}) {
    if (typeof asyncFn !== "function") {
        throw new TypeError("asyncFn must be a function");
    }

    const {
        retries = 0,
        delay = 0,
        backoff = false
    } = options;

    if (retries < 0 || delay < 0) {
        throw new Error("retries and delay must be >= 0");
    }

    let currentDelay = delay;
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            return await asyncFn();
        } catch (error) {
            lastError = error;

            if (attempt === retries) break;

            if (currentDelay > 0) {
                await sleep(currentDelay);
            }

            if (backoff) {
                currentDelay *= 2;
            }
        }
    }

    throw lastError;
}