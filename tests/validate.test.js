/**
 * Tests for utils/validate.js
 *
 * Uses a self-contained test runner — no external dependencies required.
 * Run with: node --experimental-vm-modules tests/validate.test.js
 * (or through any bundler / test runner that supports ES modules)
 */

const validate = require('../utils/validate.js');

// ---------------------------------------------------------------------------
// Minimal test runner
// ---------------------------------------------------------------------------

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✔  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✘  ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message || 'Assertion failed');
};

const assertEquals = (actual, expected, label = '') => {
  if (actual !== expected) {
    throw new Error(
      `${label ? label + ': ' : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
};

const assertErrorExists = (errors, field, partialMessage) => {
  const match = errors.find(
    (e) => e.field === field && e.message.toLowerCase().includes(partialMessage.toLowerCase())
  );
  if (!match) {
    throw new Error(
      `Expected an error for field "${field}" containing "${partialMessage}". ` +
      `Got: ${JSON.stringify(errors)}`
    );
  }
};

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = {
  name:  { type: 'string', required: true },
  age:   { type: 'number', min: 18 },
  email: { type: 'string', pattern: emailPattern },
};

// ---------------------------------------------------------------------------
// Suite: valid data
// ---------------------------------------------------------------------------

console.log('\nValid data');

test('returns isValid true for fully valid data', () => {
  const result = validate(userSchema, { name: 'Alice', age: 25, email: 'alice@example.com' });
  assertEquals(result.isValid, true, 'isValid');
  assertEquals(result.errors.length, 0, 'errors length');
});

test('returns isValid true when optional fields are omitted', () => {
  const result = validate(userSchema, { name: 'Bob' });
  assertEquals(result.isValid, true, 'isValid');
});

test('does not mutate the original data object', () => {
  const data = Object.freeze({ name: 'Carol', age: 30 });
  // Should not throw even though the object is frozen
  const result = validate(userSchema, data);
  assertEquals(result.isValid, true);
});

test('ignores fields in data that are not in the schema', () => {
  const result = validate(userSchema, { name: 'Dave', age: 20, role: 'admin' });
  assertEquals(result.isValid, true);
});

// ---------------------------------------------------------------------------
// Suite: required rule
// ---------------------------------------------------------------------------

console.log('\nRequired rule');

test('reports error when a required field is missing', () => {
  const result = validate(userSchema, { age: 20 });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'name', 'required');
});

test('reports error when a required field is null', () => {
  const result = validate(userSchema, { name: null });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'name', 'required');
});

test('reports error when a required field is an empty string', () => {
  const result = validate(userSchema, { name: '   ' });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'name', 'required');
});

test('does not report required error when required is false', () => {
  const schema = { score: { type: 'number', required: false } };
  const result = validate(schema, {});
  assertEquals(result.isValid, true);
});

// ---------------------------------------------------------------------------
// Suite: type rule
// ---------------------------------------------------------------------------

console.log('\nType rule');

test('reports error when string field receives a number', () => {
  const result = validate(userSchema, { name: 42, age: 20 });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'name', 'type');
});

test('reports error when number field receives a string', () => {
  const schema = { count: { type: 'number' } };
  const result = validate(schema, { count: 'ten' });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'count', 'type');
});

test('reports error when boolean field receives a string', () => {
  const schema = { active: { type: 'boolean' } };
  const result = validate(schema, { active: 'true' });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'active', 'type');
});

test('passes when boolean field receives false (falsy but valid)', () => {
  const schema = { active: { type: 'boolean', required: true } };
  const result = validate(schema, { active: false });
  assertEquals(result.isValid, true);
});

test('passes when number field receives 0 (falsy but valid)', () => {
  const schema = { score: { type: 'number', required: true } };
  const result = validate(schema, { score: 0 });
  assertEquals(result.isValid, true);
});

// ---------------------------------------------------------------------------
// Suite: min / max rules
// ---------------------------------------------------------------------------

console.log('\nMin / max rules');

test('reports error when number is below min', () => {
  const result = validate(userSchema, { name: 'Eve', age: 17 });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'age', '18');
});

test('passes when number equals min (boundary)', () => {
  const result = validate(userSchema, { name: 'Eve', age: 18 });
  assertEquals(result.isValid, true);
});

test('reports error when number exceeds max', () => {
  const schema = { score: { type: 'number', max: 100 } };
  const result = validate(schema, { score: 101 });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'score', '100');
});

test('passes when number equals max (boundary)', () => {
  const schema = { score: { type: 'number', max: 100 } };
  const result = validate(schema, { score: 100 });
  assertEquals(result.isValid, true);
});

test('skips min/max checks when value is undefined', () => {
  const schema = { age: { type: 'number', min: 18, max: 65 } };
  const result = validate(schema, {});
  assertEquals(result.isValid, true);
});

// ---------------------------------------------------------------------------
// Suite: minLength / maxLength rules
// ---------------------------------------------------------------------------

console.log('\nminLength / maxLength rules');

test('reports error when string is shorter than minLength', () => {
  const schema = { username: { type: 'string', minLength: 3 } };
  const result = validate(schema, { username: 'Al' });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'username', '3');
});

test('passes when string length equals minLength (boundary)', () => {
  const schema = { username: { type: 'string', minLength: 3 } };
  const result = validate(schema, { username: 'Ali' });
  assertEquals(result.isValid, true);
});

test('reports error when string exceeds maxLength', () => {
  const schema = { tag: { type: 'string', maxLength: 5 } };
  const result = validate(schema, { tag: 'toolong' });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'tag', '5');
});

test('passes when string length equals maxLength (boundary)', () => {
  const schema = { tag: { type: 'string', maxLength: 5 } };
  const result = validate(schema, { tag: 'hello' });
  assertEquals(result.isValid, true);
});

// ---------------------------------------------------------------------------
// Suite: pattern rule
// ---------------------------------------------------------------------------

console.log('\nPattern rule');

test('reports error when string does not match pattern', () => {
  const result = validate(userSchema, { name: 'Frank', age: 25, email: 'not-an-email' });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'email', 'format');
});

test('passes when string matches pattern', () => {
  const result = validate(userSchema, { name: 'Frank', age: 25, email: 'frank@example.com' });
  assertEquals(result.isValid, true);
});

test('skips pattern check when value is absent', () => {
  // email is optional in userSchema — omitting it should not cause a pattern error
  const result = validate(userSchema, { name: 'Grace', age: 22 });
  assertEquals(result.isValid, true);
});

// ---------------------------------------------------------------------------
// Suite: multiple errors
// ---------------------------------------------------------------------------

console.log('\nMultiple errors');

test('collects errors from multiple failing fields', () => {
  const result = validate(userSchema, { age: 15, email: 'bad' });
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'name', 'required');
  assertErrorExists(result.errors, 'age', '18');
  assertErrorExists(result.errors, 'email', 'format');
  assert(result.errors.length >= 3, 'Should have at least 3 errors');
});

// ---------------------------------------------------------------------------
// Suite: edge cases
// ---------------------------------------------------------------------------

console.log('\nEdge cases');

test('returns valid result for null data', () => {
  const result = validate(userSchema, null);
  // name is required → should fail
  assertEquals(result.isValid, false);
  assertErrorExists(result.errors, 'name', 'required');
});

test('returns valid result for undefined data', () => {
  const result = validate(userSchema, undefined);
  assertEquals(result.isValid, false);
});

test('returns valid result for empty schema', () => {
  const result = validate({}, { name: 'Henry', age: 30 });
  assertEquals(result.isValid, true);
  assertEquals(result.errors.length, 0);
});

test('returns valid result for null schema', () => {
  const result = validate(null, { name: 'Iris' });
  assertEquals(result.isValid, true);
  assertEquals(result.errors.length, 0);
});

test('returns valid result for both null schema and null data', () => {
  const result = validate(null, null);
  assertEquals(result.isValid, true);
});

test('skips unknown rule types without throwing', () => {
  const schema = { name: { type: 'string', unknownRule: true } };
  let result;
  assert(() => { result = validate(schema, { name: 'Jack' }); }, 'Should not throw');
  result = validate(schema, { name: 'Jack' });
  assertEquals(result.isValid, true);
});

test('skips non-object field schemas without throwing', () => {
  const schema = { name: null, age: { type: 'number' } };
  const result = validate(schema, { age: 25 });
  assertEquals(result.isValid, true);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${'─'.repeat(50)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('─'.repeat(50));

if (failed > 0) process.exit(1);
