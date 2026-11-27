'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { validateEmail } = require('../utils/validateEmail.js');

test('valid email returns true', () => {
  assert.equal(validateEmail('test@yahoo.com'), true);
});

test('invalid email returns false', () => {
  assert.equal(validateEmail('abc.com'), false);
});
