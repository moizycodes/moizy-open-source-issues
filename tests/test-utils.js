/**
 * A simple testing utility for running test cases and asserting conditions.
 *
 * Provides functions to define tests, make assertions, and print a summary of results.
 *
 * Usage:
 * const { test, assertEquals, printSummary } = require('./test-utils.js');
 *
 * test("example test", () => {
 *     assertEquals(1 + 1, 2);
 * });
 *
 * printSummary();
 */

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✘  ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message || "Assertion failed");
};

const assertEquals = (actual, expected, label = "") => {
  if (actual !== expected) {
    throw new Error(
      `${label ? label + ": " : ""}expected ${JSON.stringify(expected)}, ` +
        `got ${JSON.stringify(actual)}`,
    );
  }
};

const assertErrorExists = (errors, field, partialMessage) => {
  const match = errors.find(
    (err) =>
      err.field === field && err.message.includes(partialMessage.toLowerCase()),
  );
  if (!match) {
    throw new Error(
      `Expected an error for field "${field}" containing "${partialMessage}". ` +
        `Got: ${JSON.stringify(errors)}`,
    );
  }
};

const assertThrows = (fn, partialMessage = "") => {
  try {
    fn();
    throw new Error("Expected function to throw, but it did not");
  } catch (err) {
    if (err.message === "Expected function to throw, but it did not") throw err;
    if (partialMessage && !err.message.includes(partialMessage)) {
      throw new Error(
        `Expected error message to include "${partialMessage}", got "${err.message}"`,
      );
    }
  }
};

const printSummary = () => {
  console.log("\n" + "─".repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("─".repeat(50));
  if (failed > 0) process.exit(1);
};

module.exports = {test, assert, assertEquals, assertErrorExists, assertThrows, printSummary};