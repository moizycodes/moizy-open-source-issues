const test = require('node:test');
const assert = require('node:assert/strict');

const flattenObject = require('../utils/flattenObject');

test('flattenObject joins nested keys with dots', () => {
  const nestedUser = {
    user: {
      name: 'Moeez',
      address: {
        city: 'Lahore'
      }
    }
  };

  assert.deepEqual(flattenObject(nestedUser), {
    'user.name': 'Moeez',
    'user.address.city': 'Lahore'
  });
  assert.deepEqual(flattenObject({ a: { b: { c: 1 } } }), { 'a.b.c': 1 });
});

test('flattenObject returns an empty object for empty or invalid input', () => {
  assert.deepEqual(flattenObject({}), {});
  assert.deepEqual(flattenObject(null), {});
  assert.deepEqual(flattenObject('invalid'), {});
});

test('flattenObject keeps primitive and null values', () => {
  const input = {
    user: {
      name: 'Ali',
      age: 25,
      active: true,
      address: null
    }
  };

  assert.deepEqual(flattenObject(input), {
    'user.name': 'Ali',
    'user.age': 25,
    'user.active': true,
    'user.address': null
  });
});

test('flattenObject keeps arrays as values', () => {
  const input = {
    product: {
      name: 'Laptop',
      tags: ['electronics', 'computer'],
      price: 1200
    }
  };

  assert.deepEqual(flattenObject(input), {
    'product.name': 'Laptop',
    'product.tags': ['electronics', 'computer'],
    'product.price': 1200
  });
});

test('flattenObject does not mutate the input object', () => {
  const originalObject = {
    settings: {
      theme: {
        color: 'dark'
      }
    }
  };

  assert.deepEqual(flattenObject(originalObject), { 'settings.theme.color': 'dark' });
  assert.deepEqual(originalObject, { settings: { theme: { color: 'dark' } } });
});
