/**
 * Validates and normalizes a redirect URL against a trusted origin policy.
 *
 * Relative paths and absolute HTTP(S) URLs are accepted only when their
 * resolved origin matches `baseUrl` or one of the explicitly allowed origins.
 * Protocol-relative URLs, credentials, and non-HTTP(S) schemes are rejected.
 *
 * @param {string} candidate - The redirect URL to validate.
 * @param {Object} options - Redirect validation options.
 * @param {string} options.baseUrl - Absolute HTTP(S) URL used to resolve relative paths.
 * @param {string[]} [options.allowedOrigins=[]] - Additional trusted origins, expressed as origins only.
 * @returns {{ valid: boolean, normalizedUrl: string|null, reason: string|null }}
 * @example
 * validateRedirectUrl("/dashboard", { baseUrl: "https://example.com" });
 * // { valid: true, normalizedUrl: "https://example.com/dashboard", reason: null }
 */
function validateRedirectUrl(candidate, options = {}) {
  const reject = (reason) => ({ valid: false, normalizedUrl: null, reason });

  if (!options || typeof options !== "object" || Array.isArray(options)) {
    return reject("invalid_options");
  }

  if (typeof options.baseUrl !== "string" || options.baseUrl.trim() === "") {
    return reject("invalid_base_url");
  }

  let baseUrl;

  try {
    baseUrl = new URL(options.baseUrl.trim());
  } catch {
    return reject("invalid_base_url");
  }

  if (
    !["http:", "https:"].includes(baseUrl.protocol) ||
    baseUrl.username !== "" ||
    baseUrl.password !== ""
  ) {
    return reject("invalid_base_url");
  }

  const allowedOrigins = options.allowedOrigins ?? [];

  if (!Array.isArray(allowedOrigins)) {
    return reject("invalid_allowed_origins");
  }

  const trustedOrigins = new Set([baseUrl.origin]);

  for (const origin of allowedOrigins) {
    if (typeof origin !== "string" || origin.trim() === "") {
      return reject("invalid_allowed_origins");
    }

    let parsedOrigin;

    try {
      parsedOrigin = new URL(origin.trim());
    } catch {
      return reject("invalid_allowed_origins");
    }

    if (
      !["http:", "https:"].includes(parsedOrigin.protocol) ||
      parsedOrigin.username !== "" ||
      parsedOrigin.password !== "" ||
      parsedOrigin.pathname !== "/" ||
      parsedOrigin.search !== "" ||
      parsedOrigin.hash !== ""
    ) {
      return reject("invalid_allowed_origins");
    }

    trustedOrigins.add(parsedOrigin.origin);
  }

  if (typeof candidate !== "string" || candidate.trim() === "") {
    return reject("invalid_candidate");
  }

  const value = candidate.trim();

  if (/[\u0000-\u001f\u007f]/.test(value)) {
    return reject("invalid_candidate");
  }

  if (/^[\\/]{2}/.test(value)) {
    return reject("protocol_relative_url");
  }

  const schemeMatch = value.match(/^([a-z][a-z\d+.-]*):/i);

  if (schemeMatch && !["http:", "https:"].includes(`${schemeMatch[1].toLowerCase()}:`)) {
    return reject("unsafe_protocol");
  }

  let resolvedUrl;

  try {
    resolvedUrl = new URL(value, baseUrl);
  } catch {
    return reject("invalid_candidate");
  }

  if (!["http:", "https:"].includes(resolvedUrl.protocol)) {
    return reject("unsafe_protocol");
  }

  if (resolvedUrl.username !== "" || resolvedUrl.password !== "") {
    return reject("credentials_not_allowed");
  }

  if (!trustedOrigins.has(resolvedUrl.origin)) {
    return reject("origin_not_allowed");
  }

  return {
    valid: true,
    normalizedUrl: resolvedUrl.href,
    reason: null,
  };
}

module.exports = validateRedirectUrl;
