const test = require("node:test");
const assert = require("node:assert/strict");

const createRequestId = require("../utils/createRequestId");

test("generates request IDs with the req_ prefix and UUID format", () => {
  assert.match(
    createRequestId(),
    /^req_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
  );
});

test("generates distinct IDs for separate requests", () => {
  const ids = new Set(Array.from({ length: 1000 }, () => createRequestId()));
  assert.equal(ids.size, 1000);
});

test("reuses an existing request ID", () => {
  assert.equal(createRequestId("external-request-123"), "external-request-123");
});

test("trims whitespace around an existing request ID", () => {
  assert.equal(createRequestId("  external-request-123  "), "external-request-123");
});

test("generates a new ID when the existing ID is empty or whitespace-only", () => {
  assert.match(createRequestId(""), /^req_/);
  assert.match(createRequestId("   "), /^req_/);
});

test("generates a new ID for non-string input", () => {
  for (const value of [undefined, null, 123, {}, []]) {
    assert.match(createRequestId(value), /^req_/);
  }
});

test("generates a new ID for overlong or control-character input", () => {
  assert.match(createRequestId("x".repeat(129)), /^req_/);
  assert.match(createRequestId("request\nid"), /^req_/);
  assert.match(createRequestId("request\u007fid"), /^req_/);
});
