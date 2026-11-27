const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const checkSecurityHeaders = require('../utils/checkSecurityHeader');

describe('checkSecurityHeaders()', () => {
  it('identifies correctly configured headers (All present)', () => {
    const input = {
      "Content-Security-Policy": "default-src 'self'",
      "Strict-Transport-Security": "max-age=31536000",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin",
      "Permissions-Policy": "geolocation=()",
      "X-Frame-Options": "DENY"
    };
    const result = checkSecurityHeaders(input);
    assert.equal(result.score, 100);
    assert.equal(result.present.length, 6);
    assert.equal(result.missing.length, 0);
  });

  it('handles mixed-case header names case-insensitively', () => {
    const input = {
      "cOnTeNt-sEcUrItY-PoLiCy": "default-src 'self'",
      "X-coNTent-TypE-OptionS": "nosniff"
    };
    const result = checkSecurityHeaders(input);
    assert.ok(result.present.includes("content-security-policy"));
    assert.ok(result.present.includes("x-content-type-options"));
    assert.equal(result.score, 33); // 2 out of 6
  });

  it('handles empty, null, or undefined input safely', () => {
    assert.deepEqual(checkSecurityHeaders(null), { score: 0, missing: [], present: [] });
    assert.deepEqual(checkSecurityHeaders(undefined), { score: 0, missing: [], present: [] });
    assert.deepEqual(checkSecurityHeaders("invalid"), { score: 0, missing: [], present: [] });
  });

  it('fails headers with invalid values where practical', () => {
    const input = {
      // Invalid because it lacks max-age=
      "Strict-Transport-Security": "includeSubDomains", 
      // Invalid because it is not 'nosniff'
      "X-Content-Type-Options": "invalid-value" 
    };
    const result = checkSecurityHeaders(input);
    assert.ok(result.missing.includes("strict-transport-security"));
    assert.ok(result.missing.includes("x-content-type-options"));
  });

  it('allows configurable recommended header lists', () => {
    const input = { "x-custom-security": "1" };
    const options = { customHeaders: ["X-Custom-Security", "Another-Header"] };
    const result = checkSecurityHeaders(input, options);
    
    assert.equal(result.score, 50);
    assert.deepEqual(result.present, ["x-custom-security"]);
    assert.deepEqual(result.missing, ["another-header"]);
  });

  it('does not mutate the original headers object', () => {
    const input = { "X-Frame-Options": "SAMEORIGIN" };
    const inputCopy = { ...input };
    checkSecurityHeaders(input);
    assert.deepEqual(input, inputCopy);
  });
});