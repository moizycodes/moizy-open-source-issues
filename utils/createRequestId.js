const { randomUUID } = require("node:crypto");

const MAX_REQUEST_ID_LENGTH = 128;

/**
 * Creates a request ID from an incoming request ID or generates a random one.
 *
 * Existing IDs are trimmed and reused when they are non-empty, no longer than
 * 128 characters, and contain no control characters. Invalid or missing IDs
 * are replaced with a cryptographically random UUID prefixed with `req_`.
 *
 * @param {string} [existingRequestId] - An ID supplied by an incoming request header.
 * @returns {string} A reusable or newly generated request ID.
 * @example
 * const requestId = createRequestId(req.headers["x-request-id"]);
 * res.setHeader("X-Request-ID", requestId);
 * logger.info({ requestId }, "Request received");
 */
function createRequestId(existingRequestId) {
  if (typeof existingRequestId === "string") {
    const normalizedId = existingRequestId.trim();

    if (
      normalizedId.length > 0 &&
      normalizedId.length <= MAX_REQUEST_ID_LENGTH &&
      !/[\u0000-\u001f\u007f]/.test(normalizedId)
    ) {
      return normalizedId;
    }
  }

  return `req_${randomUUID()}`;
}

module.exports = createRequestId;
