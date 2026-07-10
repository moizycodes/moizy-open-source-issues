"use strict";

const fs = require("fs");
const path = require("path");

const parseEnv = require("../env-sync-checker/lib/parser.js");

// ------------------------------
// Simple test runner
// ------------------------------

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`✔ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✘ ${name}`);
    console.log(err.message);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

// ------------------------------
// Temporary test file helper
// ------------------------------

function createTestFile(content) {
  const filePath = path.join(__dirname, "temp.env");
  fs.writeFileSync(filePath, content);
  return filePath;
}

function removeTestFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// ------------------------------
// Tests
// ------------------------------

console.log("\nParser Tests\n");

test("reads environment variables correctly", () => {
  const filePath = createTestFile(`
DATABASE_URL=mysql
JWT_SECRET=abc123
`);

  const result = parseEnv(filePath);

  assert(
    result.variables.DATABASE_URL === "mysql",
    "DATABASE_URL should be parsed"
  );

  assert(
    result.variables.JWT_SECRET === "abc123",
    "JWT_SECRET should be parsed"
  );

  removeTestFile(filePath);
});


test("ignores comments and empty lines", () => {
  const filePath = createTestFile(`
# Database config

DATABASE_URL=mysql
`);

  const result = parseEnv(filePath);

  assert(
    Object.keys(result.variables).length === 1,
    "Comments should not be included"
  );

  assert(
    result.variables.DATABASE_URL === "mysql",
    "DATABASE_URL should exist"
  );

  removeTestFile(filePath);
});


test("detects duplicate keys", () => {
  const filePath = createTestFile(`
DATABASE_URL=mysql
DATABASE_URL=test
`);

  const result = parseEnv(filePath);

  assert(
    result.duplicates.includes("DATABASE_URL"),
    "Duplicate key should be detected"
  );

  removeTestFile(filePath);
});


test("detects empty variable names", () => {
  const filePath = createTestFile(`
=value
`);

  const result = parseEnv(filePath);

  assert(
    result.emptyKeys.length > 0,
    "Empty key should be detected"
  );

  removeTestFile(filePath);
});


test("returns empty variables for empty file", () => {
  const filePath = createTestFile("");

  const result = parseEnv(filePath);

  assert(
    Object.keys(result.variables).length === 0,
    "Empty file should have no variables"
  );

  removeTestFile(filePath);
});



console.log("\n--------------------");
console.log(`${passed} passed, ${failed} failed`);
console.log("--------------------");

if (failed > 0) {
  process.exit(1);
}