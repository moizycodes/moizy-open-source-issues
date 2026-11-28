const test = require("node:test");
const assert = require("node:assert/strict");

const validateRedirectUrl = require("../utils/validateRedirectUrl");

const options = { baseUrl: "https://example.com" };

test("accepts and normalizes a relative path", () => {
  assert.deepEqual(validateRedirectUrl("/dashboard", options), {
    valid: true,
    normalizedUrl: "https://example.com/dashboard",
    reason: null,
  });
});

test("accepts a same-origin absolute URL", () => {
  const result = validateRedirectUrl("https://example.com/account?tab=profile#details", options);
  assert.equal(result.valid, true);
  assert.equal(result.normalizedUrl, "https://example.com/account?tab=profile#details");
  assert.equal(result.reason, null);
});

test("resolves relative paths against a base URL containing a path", () => {
  const result = validateRedirectUrl("settings", { baseUrl: "https://example.com/app/" });
  assert.equal(result.normalizedUrl, "https://example.com/app/settings");
});

test("rejects an external origin by default", () => {
  assert.deepEqual(validateRedirectUrl("https://malicious.example", options), {
    valid: false,
    normalizedUrl: null,
    reason: "origin_not_allowed",
  });
});

test("rejects lookalike hostnames rather than trusting string prefixes", () => {
  const result = validateRedirectUrl("https://example.com.malicious.example/path", options);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "origin_not_allowed");
});

test("accepts an explicitly allowed origin", () => {
  const result = validateRedirectUrl("https://trusted.example/return", {
    ...options,
    allowedOrigins: ["https://trusted.example"],
  });
  assert.equal(result.valid, true);
  assert.equal(result.normalizedUrl, "https://trusted.example/return");
});

test("rejects protocol-relative URLs", () => {
  for (const candidate of ["//malicious.example/path", "\\\\malicious.example/path", "/\\malicious.example/path"]) {
    assert.equal(validateRedirectUrl(candidate, options).reason, "protocol_relative_url");
  }
});

test("rejects dangerous and unsupported schemes", () => {
  for (const candidate of ["javascript:alert(1)", "data:text/html,hello", "file:///etc/passwd", "ftp://example.com/file"]) {
    assert.equal(validateRedirectUrl(candidate, options).reason, "unsafe_protocol");
  }
});

test("rejects credentials even when the resulting origin is trusted", () => {
  const result = validateRedirectUrl("https://user:password@example.com/path", options);
  assert.equal(result.valid, false);
  assert.equal(result.reason, "credentials_not_allowed");
});

test("rejects empty, whitespace-only, malformed, and non-string candidates", () => {
  for (const candidate of ["", "   ", "http://[", null, 42, {}, undefined]) {
    assert.equal(validateRedirectUrl(candidate, options).valid, false);
  }
});

test("rejects invalid base URLs and invalid options", () => {
  assert.equal(validateRedirectUrl("/path", {}).reason, "invalid_base_url");
  assert.equal(validateRedirectUrl("/path", { baseUrl: "javascript:alert(1)" }).reason, "invalid_base_url");
  assert.equal(validateRedirectUrl("/path", { baseUrl: "https://user:pass@example.com" }).reason, "invalid_base_url");
  assert.equal(validateRedirectUrl("/path", null).reason, "invalid_options");
});

test("rejects malformed allowed-origin configuration", () => {
  assert.equal(validateRedirectUrl("/path", { ...options, allowedOrigins: "https://trusted.example" }).reason, "invalid_allowed_origins");
  assert.equal(validateRedirectUrl("/path", { ...options, allowedOrigins: ["not a URL"] }).reason, "invalid_allowed_origins");
  assert.equal(validateRedirectUrl("/path", { ...options, allowedOrigins: ["https://trusted.example/path"] }).reason, "invalid_allowed_origins");
});

test("does not mutate the provided options or allowlist", () => {
  const allowedOrigins = ["https://trusted.example"];
  const inputOptions = { baseUrl: "https://example.com", allowedOrigins };
  const originalOptions = structuredClone(inputOptions);
  validateRedirectUrl("https://trusted.example/path", inputOptions);
  assert.deepEqual(inputOptions, originalOptions);
});

test("rejects control characters in candidates", () => {
  assert.equal(validateRedirectUrl("/safe\nLocation: https://evil.example", options).reason, "invalid_candidate");
});
