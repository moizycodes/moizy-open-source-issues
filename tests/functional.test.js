/**
 * Tests for utils/functional.js
 *
 * Run with: node tests/functional.test.js
 */

const { test, assertEquals, assertThrows, printSummary } = require("./test-utils.js");
const { pipe, compose } = require("../utils/functional.js");

test("pipe should apply functions from left to right", () => {
  const add = (x) => x + 1;
  const double = (x) => x * 2;

  const piped = pipe(add, double);

  assertEquals(piped(3), 8);
});

test("compose should apply functions from right to left", () => {
  const add = (x) => x + 1;
  const double = (x) => x * 2;

  const composed = compose(add, double);

  assertEquals(composed(3), 7);
});

test("pipe and compose should return identity function when no functions are provided", () => {
  const piped = pipe();
  const composed = compose();

  assertEquals(piped(5), 5);
  assertEquals(composed(5), 5);
});

test("pipe and compose should throw TypeError for non-function arguments", () => {
  const add = (x) => x + 1;
  const double = (x) => x * 2;

  assertThrows(() => pipe(3, add, double), "not a function");
  assertThrows(() => compose(3, add, double), "not a function");
});

printSummary();
