const test = require('node:test');
const assert = require('node:assert/strict');

const pick = require('../utils/pick');

const user = {
  id: 1,
  name: 'Moeez',
  email: 'moeez@gmail.com',
  password: '123456'
};

test('pick keeps only the given keys', () => {
  assert.deepEqual(pick(user, ['id', 'name']), { id: 1, name: 'Moeez' });
  assert.deepEqual(pick(user, ['email']), { email: 'moeez@gmail.com' });
});

test('pick ignores keys that are not on the object', () => {
  assert.deepEqual(pick({}, ['a']), {});
});

test('pick returns an empty object for a null object', () => {
  assert.deepEqual(pick(null, ['a']), {});
});

test('pick does not mutate the input object', () => {
  const input = { id: 1, password: '123456' };

  pick(input, ['id']);

  assert.deepEqual(input, { id: 1, password: '123456' });
});
