'use strict';

const assert = require('assert');
const validateDateTimeFormat = require('../utils/validateDateTimeFormat');

let passed = 0;
let failed = 0;

function test(name, callback) {
  try {
    callback();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL: ${name}`);
    console.error(error);
  }
}

function expectError(value, expectedType, options) {
  const result = validateDateTimeFormat(value, options);
  assert.strictEqual(result.valid, false);
  assert.strictEqual(result.error.type, expectedType);
  assert.strictEqual(typeof result.error.message, 'string');
}

test('accepts a UTC ISO date-time', () => {
  assert.deepStrictEqual(validateDateTimeFormat('2026-11-17T10:30:00Z', { requireTimezone: true }), {
    valid: true, type: 'date-time', error: null
  });
});

test('accepts positive and negative timezone offsets', () => {
  assert.strictEqual(validateDateTimeFormat('2026-11-17T10:30:00+05:30').valid, true);
  assert.strictEqual(validateDateTimeFormat('2026-11-17T10:30:00-04:00').valid, true);
});

test('accepts the maximum ISO timezone offset', () => {
  assert.strictEqual(validateDateTimeFormat('2026-11-17T10:30:00+14:00').valid, true);
  assert.strictEqual(validateDateTimeFormat('2026-11-17T10:30:00-14:00').valid, true);
});

test('accepts fractional seconds from one through nine digits', () => {
  for (const fraction of ['1', '12', '123', '123456789']) {
    assert.strictEqual(validateDateTimeFormat(`2026-11-17T10:30:00.${fraction}Z`).valid, true);
  }
});

test('rejects fractions longer than nine digits', () => {
  expectError('2026-11-17T10:30:00.1234567890Z', 'invalid_format');
});

test('rejects invalid calendar dates and months', () => {
  expectError('2026-02-30T10:30:00Z', 'invalid_date');
  expectError('2026-13-01T10:30:00Z', 'invalid_date');
  expectError('2026-00-01T10:30:00Z', 'invalid_date');
  expectError('2026-04-31T10:30:00Z', 'invalid_date');
});

test('accepts leap days only in leap years', () => {
  assert.strictEqual(validateDateTimeFormat('2024-02-29T00:00:00Z').valid, true);
  expectError('2025-02-29T00:00:00Z', 'invalid_date');
  assert.strictEqual(validateDateTimeFormat('2000-02-29T00:00:00Z').valid, true);
  expectError('1900-02-29T00:00:00Z', 'invalid_date');
});

test('rejects out-of-range time components', () => {
  expectError('2026-11-17T24:00:00Z', 'invalid_time');
  expectError('2026-11-17T10:60:00Z', 'invalid_time');
  expectError('2026-11-17T10:30:60Z', 'invalid_time');
});

test('requires timezone only when configured', () => {
  assert.strictEqual(validateDateTimeFormat('2026-11-17T10:30:00').valid, true);
  expectError('2026-11-17T10:30:00', 'timezone_required', { requireTimezone: true });
});

test('does not infer UTC for a timezone-free value', () => {
  const result = validateDateTimeFormat('2026-11-17T10:30:00');
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.type, 'date-time');
});

test('rejects malformed timezone offsets', () => {
  expectError('2026-11-17T10:30:00+15:00', 'invalid_timezone');
  expectError('2026-11-17T10:30:00+14:01', 'invalid_timezone');
  expectError('2026-11-17T10:30:00+05:60', 'invalid_timezone');
  expectError('2026-11-17T10:30:00+5:30', 'invalid_format');
});

test('allows date-only values only when configured', () => {
  expectError('2026-11-17', 'date_only_not_allowed');
  assert.deepStrictEqual(validateDateTimeFormat('2026-11-17', { allowDateOnly: true }), {
    valid: true, type: 'date-only', error: null
  });
});

test('validates date-only calendar dates', () => {
  expectError('2026-02-30', 'invalid_date', { allowDateOnly: true });
  assert.strictEqual(validateDateTimeFormat('2024-02-29', { allowDateOnly: true }).valid, true);
});

test('rejects empty, whitespace, null, undefined, and non-string inputs', () => {
  expectError('', 'empty');
  expectError(' 2026-11-17T10:30:00Z', 'invalid_format');
  expectError('2026-11-17T10:30:00Z ', 'invalid_format');
  expectError(null, 'invalid_type');
  expectError(undefined, 'invalid_type');
  expectError(20261117, 'invalid_type');
  expectError(new Date(), 'invalid_type');
});

test('rejects unsupported formats and missing separators', () => {
  expectError('2026-11-17 10:30:00Z', 'invalid_format');
  expectError('17/11/2026', 'invalid_format');
  expectError('2026-11-17T10:30Z', 'invalid_format');
  expectError('2026-11-17t10:30:00z', 'invalid_format');
});

test('validates option object shape and boolean values', () => {
  expectError('2026-11-17T10:30:00Z', 'invalid_options', null);
  expectError('2026-11-17T10:30:00Z', 'invalid_options', []);
  expectError('2026-11-17T10:30:00Z', 'invalid_options', { requireTimezone: 'yes' });
  expectError('2026-11-17T10:30:00Z', 'invalid_options', { allowDateOnly: 1 });
  expectError('2026-11-17T10:30:00Z', 'invalid_options', { unsupported: true });
});

test('does not mutate the original input or options', () => {
  const value = '2026-11-17T10:30:00+05:30';
  const options = { requireTimezone: true, allowDateOnly: false };
  const originalOptions = { ...options };
  validateDateTimeFormat(value, options);
  assert.strictEqual(value, '2026-11-17T10:30:00+05:30');
  assert.deepStrictEqual(options, originalOptions);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;
