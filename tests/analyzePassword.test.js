const test = require('node:test');
const assert = require('node:assert/strict');

const analyzePassword = require('../utils/analyzePassword');

test('analyzePassword returns the expected result shape', () => {
  const result = analyzePassword('Password123');

  assert.equal(typeof result.score, 'number');
  assert.equal(typeof result.strength, 'string');
  assert.ok(Array.isArray(result.feedback));
});

test('analyzePassword keeps the score within 0 and 100', () => {
  const weak = analyzePassword('abc');
  const strong = analyzePassword('VeryLongPassword123!@#');

  assert.ok(weak.score >= 0 && weak.score <= 100);
  assert.ok(strong.score >= 0 && strong.score <= 100);
});

test('analyzePassword scores stronger passwords higher than weaker ones', () => {
  const weak = analyzePassword('abcdef');
  const strong = analyzePassword('Abcdef9!xyZ');

  assert.ok(strong.score > weak.score);
});

test('analyzePassword rewards character diversity', () => {
  const lowercaseOnly = analyzePassword('abcdefgh');
  const mixed = analyzePassword('Abcdfgh1!');

  assert.ok(mixed.score > lowercaseOnly.score);
});

test('analyzePassword flags missing character classes', () => {
  const result = analyzePassword('lowercaseonly');

  assert.ok(result.feedback.includes('Add uppercase letters'));
  assert.ok(result.feedback.includes('Add numbers'));
  assert.ok(result.feedback.includes('Add special characters'));
});

test('analyzePassword penalizes repeated characters', () => {
  const withRepeats = analyzePassword('Abc!aaaa9');
  const withoutRepeats = analyzePassword('Abc!defg9');

  assert.ok(withRepeats.feedback.includes('Avoid repeated characters'));
  assert.ok(withRepeats.score < withoutRepeats.score);
});

test('analyzePassword penalizes predictable sequences', () => {
  const result = analyzePassword('Habc!9xyzZ');

  assert.ok(result.feedback.includes('Avoid predictable sequences'));
});

test('analyzePassword flags common passwords as weak', () => {
  ['password', '123456', 'qwerty'].forEach((common) => {
    const result = analyzePassword(common);

    assert.equal(result.strength, 'Weak');
    assert.equal(result.score, 0);
    assert.ok(result.feedback.includes('This is a commonly used password'));
  });
});

test('analyzePassword is case-insensitive when detecting common passwords', () => {
  const result = analyzePassword('PASSWORD');

  assert.equal(result.strength, 'Weak');
});

test('analyzePassword classifies strength using the score bands', () => {
  assert.equal(analyzePassword('').strength, 'Weak');
  assert.equal(analyzePassword('VeryLongPassword123!@#').strength, 'Strong');
});

test('analyzePassword handles an empty password', () => {
  const result = analyzePassword('');

  assert.deepEqual(result, {
    score: 0,
    strength: 'Weak',
    feedback: ['Provide a password']
  });
});

test('analyzePassword handles null input', () => {
  const result = analyzePassword(null);

  assert.deepEqual(result, {
    score: 0,
    strength: 'Weak',
    feedback: ['Provide a password']
  });
});

test('analyzePassword handles undefined and non-string input', () => {
  assert.equal(analyzePassword(undefined).strength, 'Weak');
  assert.equal(analyzePassword(12345678).strength, 'Weak');
  assert.equal(analyzePassword({}).strength, 'Weak');
});

test('analyzePassword handles a password of only numbers', () => {
  const result = analyzePassword('19384756');

  assert.ok(result.feedback.includes('Add lowercase letters'));
  assert.ok(result.feedback.includes('Add uppercase letters'));
  assert.ok(result.feedback.includes('Add special characters'));
});

test('analyzePassword handles a password of only symbols', () => {
  const result = analyzePassword('@#$%^&*(');

  assert.ok(result.feedback.includes('Add lowercase letters'));
  assert.ok(result.feedback.includes('Add uppercase letters'));
  assert.ok(result.feedback.includes('Add numbers'));
});

test('analyzePassword rates a long, diverse password as strong', () => {
  const result = analyzePassword('VeryLongPassword123!@#');

  assert.equal(result.strength, 'Strong');
  assert.ok(result.score >= 81);
});
