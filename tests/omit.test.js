const test = require('node:test');
const assert = require('node:assert/strict');

const omit = require('../utils/omit');

const user = {
  id: 1,
  name: 'Moeez',
  email: 'moeez@gmail.com',
  password: 'secret123'
};

test('omit removes the given keys', () => {
  assert.deepEqual(omit(user, ['password']), {
    id: 1,
    name: 'Moeez',
    email: 'moeez@gmail.com'
  });
  assert.deepEqual(omit(user, ['email', 'password']), { id: 1, name: 'Moeez' });
});

test('omit ignores keys that are not on the object', () => {
  assert.deepEqual(omit({}, ['a']), {});
});

test('omit returns a copy when no keys are given', () => {
  const input = { a: 1 };
  const result = omit(input, []);

  assert.deepEqual(result, { a: 1 });
  assert.notEqual(result, input);
});

test('omit returns an empty object for a null object', () => {
  assert.deepEqual(omit(null, ['password']), {});
});

test('omit does not mutate the input object', () => {
  const input = { id: 1, password: 'secret123' };

  omit(input, ['password']);

  assert.deepEqual(input, { id: 1, password: 'secret123' });
});
