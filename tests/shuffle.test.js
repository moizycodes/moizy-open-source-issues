const test = require("node:test");
const assert = require("node:assert/strict");

const shuffle = require("../utils/shuffle");

test("returns an array", () => {
  assert.equal(Array.isArray(shuffle([1, 2, 3])), true);
});

test("keeps the same length", () => {
  assert.equal(shuffle([1, 2, 3, 4, 5]).length, 5);
});

test("contains the same elements", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle([...original]);
  assert.deepEqual(result.sort(), original.sort());
});

test("throws TypeError for non-array input", () => {
  assert.throws(() => shuffle("hello"), TypeError);
});

test("handles empty array", () => {
  assert.deepEqual(shuffle([]), []);
});