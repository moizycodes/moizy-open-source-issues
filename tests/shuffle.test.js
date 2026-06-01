const shuffle = require("../utils/shuffle");

test("returns an array", () => {
  expect(Array.isArray(shuffle([1, 2, 3]))).toBe(true);
});

test("keeps the same length", () => {
  expect(shuffle([1, 2, 3, 4, 5]).length).toBe(5);
});

test("contains the same elements", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle([...original]);
  expect(result.sort()).toEqual(original.sort());
});

test("throws TypeError for non-array input", () => {
  expect(() => shuffle("hello")).toThrow(TypeError);
});

test("handles empty array", () => {
  expect(shuffle([])).toEqual([]);
});