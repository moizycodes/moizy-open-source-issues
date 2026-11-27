const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const { detectConfigDrift } = require("../utils/detectConfigDrift");

describe("detectConfigDrift", () => {
  test("returns no drift for identical configs", () => {
    const r = detectConfigDrift({ a: 1, b: 2 }, { a: 1, b: 2 });
    assert.equal(r.hasDrift, false);
    assert.deepEqual(r.added, []);
    assert.deepEqual(r.removed, []);
    assert.deepEqual(r.changed, []);
  });

  test("detects added property", () => {
    const r = detectConfigDrift({ a: 1 }, { a: 1, b: 2 });
    assert.deepEqual(r.added, ["b"]);
    assert.equal(r.hasDrift, true);
  });

  test("detects removed property", () => {
    const r = detectConfigDrift({ a: 1, b: 2 }, { a: 1 });
    assert.deepEqual(r.removed, ["b"]);
  });

  test("detects changed value", () => {
    const r = detectConfigDrift({ timeout: 5000 }, { timeout: 3000 });
    assert.deepEqual(r.changed, [{ key: "timeout", from: 5000, to: 3000 }]);
  });

  test("reports multiple differences", () => {
    const r = detectConfigDrift(
      { a: 1, b: 2, c: 3 },
      { a: 9, c: 3, d: 4 }
    );
    assert.equal(r.changed.length, 1);
    assert.deepEqual(r.removed, ["b"]);
    assert.deepEqual(r.added, ["d"]);
  });

  test("supports nested objects", () => {
    const r = detectConfigDrift(
      { database: { host: "staging-db", port: 5432 } },
      { database: { host: "production-db", port: 5432 } }
    );
    assert.deepEqual(r.changed, [
      { key: "database.host", from: "staging-db", to: "production-db" },
    ]);
  });

  test("handles deeply nested differences", () => {
    const r = detectConfigDrift(
      { a: { b: { c: { d: 1 } } } },
      { a: { b: { c: { d: 2 } } } }
    );
    assert.equal(r.changed[0].key, "a.b.c.d");
  });

  test("handles arrays", () => {
    const r = detectConfigDrift({ list: [1, 2, 3] }, { list: [1, 2, 4] });
    assert.equal(r.changed[0].key, "list");
  });

  test("handles empty objects", () => {
    const r = detectConfigDrift({}, {});
    assert.equal(r.hasDrift, false);
  });

  test("handles null input", () => {
    const r = detectConfigDrift(null, { a: 1 });
    assert.equal(r.hasDrift, false);
  });

  test("handles undefined input", () => {
    const r = detectConfigDrift(undefined, { a: 1 });
    assert.equal(r.hasDrift, false);
  });

  test("distinguishes missing vs undefined", () => {
    const r = detectConfigDrift({ a: 1 }, { a: undefined });
    assert.equal(r.changed.length, 1);
    assert.equal(r.changed[0].key, "a");
  });

  test("respects ignored properties", () => {
    const r = detectConfigDrift(
      { a: 1, buildId: "x" },
      { a: 1, buildId: "y" },
      { ignore: ["buildId"] }
    );
    assert.equal(r.hasDrift, false);
  });

  test("does not mutate inputs", () => {
    const base = { a: 1, nested: { x: 1 } };
    const target = { a: 2, nested: { x: 2 } };
    const baseCopy = JSON.parse(JSON.stringify(base));
    const targetCopy = JSON.parse(JSON.stringify(target));
    detectConfigDrift(base, target);
    assert.deepEqual(base, baseCopy);
    assert.deepEqual(target, targetCopy);
  });

  test("returns deterministic ordering", () => {
    const r1 = detectConfigDrift({ b: 1, a: 2 }, { b: 2, a: 1 });
    const r2 = detectConfigDrift({ a: 2, b: 1 }, { a: 1, b: 2 });
    assert.deepEqual(r1, r2);
  });
});