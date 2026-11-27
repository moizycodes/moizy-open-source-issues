const test = require('node:test');
const assert = require('node:assert/strict');

const deepClone = require('../utils/deepClone');

test('deepClone returns primitives unchanged', () => {
  assert.equal(deepClone(42), 42);
  assert.equal(deepClone('text'), 'text');
  assert.equal(deepClone(true), true);
  assert.equal(deepClone(null), null);
  assert.equal(deepClone(undefined), undefined);
});

test('deepClone copies nested objects', () => {
  const user = { name: 'Alice', preferences: { theme: 'dark' } };

  const cloned = deepClone(user);

  assert.deepEqual(cloned, user);
  assert.notEqual(cloned, user);
  assert.notEqual(cloned.preferences, user.preferences);
});

test('deepClone copies arrays and the objects inside them', () => {
  const list = [1, [2, 3], { id: 4 }];

  const cloned = deepClone(list);

  assert.deepEqual(cloned, list);
  assert.ok(Array.isArray(cloned));
  assert.notEqual(cloned[1], list[1]);
  assert.notEqual(cloned[2], list[2]);
});

test('deepClone leaves the original untouched when the clone is changed', () => {
  const user = { name: 'Alice', preferences: { theme: 'dark' }, tags: ['a'] };

  const cloned = deepClone(user);
  cloned.preferences.theme = 'light';
  cloned.tags.push('b');

  assert.deepEqual(user, { name: 'Alice', preferences: { theme: 'dark' }, tags: ['a'] });
});

test('deepClone preserves circular references', () => {
  const original = { name: 'loop' };
  original.self = original;

  const cloned = deepClone(original);

  assert.notEqual(cloned, original);
  assert.equal(cloned.self, cloned);
  assert.equal(cloned.name, 'loop');
});

test('deepClone keeps an object that is referenced twice shared in the clone', () => {
  const shared = { value: 1 };
  const original = { first: shared, second: shared };

  const cloned = deepClone(original);

  assert.equal(cloned.first, cloned.second);
  assert.notEqual(cloned.first, shared);
});
