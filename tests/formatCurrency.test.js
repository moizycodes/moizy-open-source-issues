const test = require('node:test');
const assert = require('node:assert/strict');

const formatCurrency = require('../utils/formatCurrency');

test('formatCurrency adds thousand separators and two decimals by default', () => {
  assert.equal(formatCurrency(1234567.891), '1,234,567.89');
  assert.equal(formatCurrency(5), '5.00');
  assert.equal(formatCurrency(-1234.5), '-1,234.50');
});

test('formatCurrency formats with a currency code', () => {
  assert.equal(formatCurrency(1234.5, { currency: 'USD' }), '$1,234.50');
});

test('formatCurrency respects the decimals option', () => {
  assert.equal(formatCurrency(1234.5678, { decimals: 0 }), '1,235');
  assert.equal(formatCurrency(1234.5678, { decimals: 3 }), '1,234.568');
});

test('formatCurrency respects the locale option', () => {
  assert.equal(formatCurrency(1234.5, { locale: 'de-DE' }), '1.234,50');
});

test('formatCurrency falls back to a plain number for an invalid currency code', () => {
  assert.equal(formatCurrency(10, { currency: 'NOT-A-CODE' }), '10.00');
});

test('formatCurrency returns "0.00" for values that are not numbers', () => {
  assert.equal(formatCurrency(NaN), '0.00');
  assert.equal(formatCurrency('abc'), '0.00');
  assert.equal(formatCurrency(undefined), '0.00');
});

test('formatCurrency returns null for infinite values', () => {
  assert.equal(formatCurrency(Infinity), null);
  assert.equal(formatCurrency(-Infinity), null);
});
