// import { test, assertEquals, assertThrows, printSummary } from "./test-utils.js";
// import { capitalize } from "../utils/capitalize.js";

const { test, assertEquals, assertThrows, printSummary } = require('./test-utils.js');
const capitalize = require('../utils/capitalize.js');

// Normal string
test("capitalize normal string", () => {
  assertEquals(capitalize("hello"), "Hello");
});

// Already capitalized
test("capitalize already capitalized string", () => {
  assertEquals(capitalize("Hello"), "Hello");
});

// Empty string
test("capitalize empty string", () => {
  assertEquals(capitalize(""), "");
});

// Single character
test("capitalize single character", () => {
  assertEquals(capitalize("a"), "A");
});

// Non-string input
test("capitalize throws error for non-string", () => {
  assertThrows(() => capitalize(123), "string");
});

// Print results
printSummary();