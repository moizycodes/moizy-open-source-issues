/**
 * Checks a list of URLs and returns their status.
 *
 * @param {string[]} urls
 * @returns {Promise<Array>}
 */
async function checkBrokenLinks(urls) {
  if (!Array.isArray(urls)) {
    throw new TypeError("Input must be an array of URLs");
  }

  if (urls.length === 0) {
    return [];
  }

  const results = [];

  for (const url of urls) {
    try {
      // Validate URL
      new URL(url);

      const response = await fetch(url);

      let status = "unknown";

      if (response.status >= 200 && response.status < 300) {
        status = "valid";
      } else if (response.status >= 300 && response.status < 400) {
        status = "redirect";
      } else if (response.status === 404) {
        status = "broken";
      } else if (response.status >= 500) {
        status = "server_error";
      }

      results.push({
        url,
        statusCode: response.status,
        status
      });

    } catch (error) {
      results.push({
        url,
        statusCode: null,
        status: "broken",
        error: error.message
      });
    }
  }

  return results;
}

module.exports = checkBrokenLinks;