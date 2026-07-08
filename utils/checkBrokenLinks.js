/**
 * Checks a list of URLs and returns their accessibility status.
 *
 * Sends an HTTP request to each URL and records whether it is valid
 * or broken based on the response or any network error.
 *
 * @async
 * @param {string[]} urls - An array of URLs to check.
 * @returns {Promise<Array<{url: string, statusCode?: number, status: string}>>}
 * A promise that resolves to an array containing the URL and its status.
 *
 * @example
 * const result = await checkBrokenLinks([
 *   "https://example.com",
 *   "https://invalid-url.com"
 * ]);
 *
 * console.log(result);
 * // [
 * //   { url: "https://example.com", statusCode: 200, status: "valid" },
 * //   { url: "https://invalid-url.com", status: "broken" }
 * // ]
 */
async function checkBrokenLinks(urls) {
    const result = [];

    for (let url of urls) {
        try {
            const res = await fetch(url);
            result.push({
                url: url,
                statusCode: res.status,
                status: res.status === 200 ? "valid" : "Broken"
            });
        } catch (err) {
            result.push({
                url: url,
                status: "broken",
            });
        }
    }

    return result;
}

module.exports = checkBrokenLinks;