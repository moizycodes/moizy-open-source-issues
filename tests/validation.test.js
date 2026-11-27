const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateRequired,
  validateEmail,
  validatePassword,
  validateNumber,
  validateField
} = require('../utils/validation');

const assertValid = (result) => {
  assert.deepEqual(result, { valid: true, message: '' });
};

const assertInvalid = (result) => {
  assert.equal(result.valid, false);
  assert.equal(typeof result.message, 'string');
  assert.notEqual(result.message, '');
};

test('validateRequired rejects missing and blank values', () => {
  assertInvalid(validateRequired(null));
  assertInvalid(validateRequired(undefined));
  assertInvalid(validateRequired(''));
  assertInvalid(validateRequired('   '));
});

test('validateRequired accepts any other value, including 0 and false', () => {
  assertValid(validateRequired('Moeez'));
  assertValid(validateRequired(0));
  assertValid(validateRequired(false));
});

test('validateEmail accepts well-formed addresses', () => {
  assertValid(validateEmail('user@example.com'));
  assertValid(validateEmail('first.last+tag@mail.example.org'));
});

test('validateEmail rejects malformed addresses', () => {
  assertInvalid(validateEmail('abc.com'));
  assertInvalid(validateEmail('user@domain'));
  assertInvalid(validateEmail('user name@example.com'));
  assertInvalid(validateEmail(''));
});

test('validatePassword requires at least 8 characters with a letter and a digit', () => {
  assertValid(validatePassword('abc12345'));
  assertValid(validatePassword('Passw0rd!'));

  assertInvalid(validatePassword('abc123'));
  assertInvalid(validatePassword('abcdefgh'));
  assertInvalid(validatePassword('12345678'));
});

test('validateNumber accepts numbers and numeric strings', () => {
  assertValid(validateNumber(42));
  assertValid(validateNumber('3.14'));
  assertValid(validateNumber(-7));
});

test('validateNumber rejects values that are not numeric', () => {
  assertInvalid(validateNumber('abc'));
  assertInvalid(validateNumber('12px'));
});

test('validateField passes when every rule passes', () => {
  assertValid(validateField('user@example.com', ['required', 'email']));
  assertValid(validateField('anything'));
});

test('validateField returns the result of the first rule that fails', () => {
  assert.deepEqual(validateField('', ['required', 'email']), validateRequired(''));
  assert.deepEqual(validateField('abc.com', ['required', 'email']), validateEmail('abc.com'));
});

test('validateField accepts rules given as objects', () => {
  assertInvalid(validateField('abc', [{ rule: 'number' }]));
  assertValid(validateField('42', [{ rule: 'number' }]));
});

test('validateField warns about an unknown rule and skips it', (t) => {
  const warn = t.mock.method(console, 'warn', () => {});

  assertValid(validateField('value', ['unknown-rule']));
  assert.equal(warn.mock.callCount(), 1);
});
