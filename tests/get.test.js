const test = require('node:test');
const assert = require('node:assert/strict');

const get = require('../utils/get');

const user = {
  profile: {
    address: {
      city: 'Lahore'
    },
    age: 22,
    active: false
  }
};

test('get reads a nested value from a dot-separated path', () => {
  assert.equal(get(user, 'profile.address.city'), 'Lahore');
  assert.equal(get(user, 'profile.age'), 22);
});

test('get reads a nested value from an array path', () => {
  assert.equal(get(user, ['profile', 'address', 'city']), 'Lahore');
});

test('get returns falsy values instead of the default', () => {
  assert.equal(get(user, 'profile.active', 'default'), false);
});

test('get returns the default value for a missing path', () => {
  assert.equal(get(user, 'profile.missing', 'default'), 'default');
  assert.equal(get({}, 'a.b.c', 'default'), 'default');
});

test('get returns undefined for a missing path when no default is given', () => {
  assert.equal(get(user, 'profile.address.country'), undefined);
});

test('get returns the default value when the object is null or undefined', () => {
  assert.equal(get(null, 'profile.address.city', 'not found'), 'not found');
  assert.equal(get(undefined, 'profile.address.city', 'not found'), 'not found');
});

test('get returns the default value for an empty or invalid path', () => {
  assert.equal(get(user, '', 'empty path'), 'empty path');
  assert.equal(get(user, null, 'invalid path'), 'invalid path');
});

test('get does not mutate the input object', () => {
  const originalUser = {
    profile: {
      name: 'Naveen'
    }
  };

  get(originalUser, 'profile.name');

  assert.deepEqual(originalUser, { profile: { name: 'Naveen' } });
});
