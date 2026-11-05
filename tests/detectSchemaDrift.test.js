const { test, assertEquals, printSummary } = require("./test-utils.js");
const { detectSchemaDrift } = require("../utils/detectSchemaDrift.js");

// Identical objects — no drift
test("identical objects produce no drift", () => {
  const r = detectSchemaDrift({ a: 1, b: "x" }, { a: 1, b: "x" });
  assertEquals(r.hasDrift, false);
  assertEquals(r.changes.length, 0);
});

// Added field
test("field_added is reported with actual type", () => {
  const r = detectSchemaDrift({ a: 1 }, { a: 1, b: "x" });
  assertEquals(r.hasDrift, true);
  assertEquals(r.changes.length, 1);
  assertEquals(r.changes[0].path, "$.b");
  assertEquals(r.changes[0].type, "field_added");
  assertEquals(r.changes[0].expected, null);
  assertEquals(r.changes[0].actual, "string");
});

// Removed field
test("field_removed is reported with expected type", () => {
  const r = detectSchemaDrift({ a: 1, b: "x" }, { a: 1 });
  assertEquals(r.changes.length, 1);
  assertEquals(r.changes[0].path, "$.b");
  assertEquals(r.changes[0].type, "field_removed");
  assertEquals(r.changes[0].expected, "string");
  assertEquals(r.changes[0].actual, null);
});

// Type change
test("type_changed is reported", () => {
  const r = detectSchemaDrift({ id: 42 }, { id: "42" });
  assertEquals(r.changes.length, 1);
  assertEquals(r.changes[0].path, "$.id");
  assertEquals(r.changes[0].type, "type_changed");
  assertEquals(r.changes[0].expected, "number");
  assertEquals(r.changes[0].actual, "string");
});

// Nested
test("nested objects are compared recursively", () => {
  const r = detectSchemaDrift(
    { user: { email: "a@x.com", name: "A" } },
    { user: { email: 42, name: "A" } }
  );
  assertEquals(r.changes.length, 1);
  assertEquals(r.changes[0].path, "$.user.email");
  assertEquals(r.changes[0].type, "type_changed");
});

// Deep nesting
test("deeply nested difference reports full path", () => {
  const r = detectSchemaDrift({ a: { b: { c: 1 } } }, { a: { b: { c: "1" } } });
  assertEquals(r.changes[0].path, "$.a.b.c");
});

// Empty objects
test("empty objects produce no drift", () => {
  const r = detectSchemaDrift({}, {});
  assertEquals(r.hasDrift, false);
});

// Empty arrays
test("empty arrays produce no drift", () => {
  const r = detectSchemaDrift([], []);
  assertEquals(r.hasDrift, false);
});

// Array item type change
test("array_item_type_changed is reported", () => {
  const r = detectSchemaDrift({ list: [1, 2] }, { list: ["a", "b"] });
  assertEquals(r.changes.length, 1);
  assertEquals(r.changes[0].path, "$.list");
  assertEquals(r.changes[0].type, "array_item_type_changed");
  assertEquals(r.changes[0].expected, "number");
  assertEquals(r.changes[0].actual, "string");
});

// null vs object
test("null vs object is type_changed", () => {
  const r = detectSchemaDrift({ a: null }, { a: {} });
  assertEquals(r.changes[0].path, "$.a");
  assertEquals(r.changes[0].expected, "null");
  assertEquals(r.changes[0].actual, "object");
});

// null vs array
test("null vs array is type_changed", () => {
  const r = detectSchemaDrift({ a: null }, { a: [] });
  assertEquals(r.changes[0].expected, "null");
  assertEquals(r.changes[0].actual, "array");
});

// Multiple changes
test("multiple changes are all reported", () => {
  const r = detectSchemaDrift(
    { id: 42, name: "A", email: "e" },
    { id: "42", name: "A", username: "u" }
  );
  assertEquals(r.changes.length, 3);
});

// Missing root values
test("undefined expected is reported", () => {
  const r = detectSchemaDrift(undefined, { a: 1 });
  assertEquals(r.hasDrift, true);
  assertEquals(r.changes[0].expected, "undefined");
  assertEquals(r.changes[0].actual, "object");
});

test("undefined actual is reported", () => {
  const r = detectSchemaDrift({ a: 1 }, undefined);
  assertEquals(r.hasDrift, true);
});

// Arrays containing nested objects — item type is object in both
test("arrays of objects produce no drift on item type", () => {
  const r = detectSchemaDrift([{ id: 1 }, { id: 2 }], [{ id: "1" }, { id: 2 }]);
  assertEquals(r.hasDrift, false);
});

// Immutability
test("inputs are not mutated", () => {
  const exp = { a: 1, nested: { b: 2 } };
  const act = { a: "1", nested: { b: 2 } };
  const expCopy = JSON.parse(JSON.stringify(exp));
  const actCopy = JSON.parse(JSON.stringify(act));
  detectSchemaDrift(exp, act);
  assertEquals(JSON.stringify(exp), JSON.stringify(expCopy));
  assertEquals(JSON.stringify(act), JSON.stringify(actCopy));
});

// Deterministic ordering
test("output ordering is deterministic", () => {
  const r1 = detectSchemaDrift({ b: 1, a: 2, c: 3 }, { b: 9, a: 9, c: 9 });
  const r2 = detectSchemaDrift({ a: 2, c: 3, b: 1 }, { a: 9, c: 9, b: 9 });
  assertEquals(JSON.stringify(r1), JSON.stringify(r2));
});

// Issue example end-to-end
test("issue example: id type + email removed + username added", () => {
  const r = detectSchemaDrift(
    { id: 42, name: "Abdul", email: "abdul@example.com" },
    { id: "42", name: "Abdul", username: "Abdul" }
  );
  assertEquals(r.hasDrift, true);
  assertEquals(r.changes.length, 3);
  assertEquals(r.changes[0].path, "$.email");
  assertEquals(r.changes[1].path, "$.id");
  assertEquals(r.changes[2].path, "$.username");
});

printSummary();