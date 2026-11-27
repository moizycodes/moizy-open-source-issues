const test = require('node:test');
const assert = require('node:assert/strict');

const Cache = require('../Cache');

test('Cache stores and retrieves values', () => {
  const cache = new Cache();

  cache.set('user', { id: 1, name: 'Moeez' });

  assert.deepEqual(cache.get('user'), { id: 1, name: 'Moeez' });
  assert.equal(cache.has('user'), true);
});

test('Cache returns undefined for a missing key', () => {
  const cache = new Cache();

  assert.equal(cache.get('missing'), undefined);
  assert.equal(cache.has('missing'), false);
});

test('Cache deletes a single item', () => {
  const cache = new Cache();
  cache.set('user', { id: 1 });

  assert.equal(cache.delete('user'), true);
  assert.equal(cache.get('user'), undefined);
  assert.equal(cache.delete('user'), false);
});

test('Cache reports its size and clears all items', () => {
  const cache = new Cache();
  cache.set('key1', 'value1');
  cache.set('key2', 'value2');

  assert.equal(cache.size(), 2);

  cache.clear();

  assert.equal(cache.size(), 0);
});

test('Cache expires an item once its TTL has passed', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const cache = new Cache();
  cache.set('token', 'abc123', 500);

  t.mock.timers.tick(500);
  assert.equal(cache.get('token'), 'abc123');
  assert.equal(cache.has('token'), true);

  t.mock.timers.tick(1);
  assert.equal(cache.get('token'), undefined);
  assert.equal(cache.has('token'), false);
});

test('Cache does not count expired items in its size', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const cache = new Cache();
  cache.set('short', 'value', 100);
  cache.set('permanent', 'value');

  t.mock.timers.tick(101);

  assert.equal(cache.size(), 1);
});

test('Cache keeps items without a TTL until they are deleted', (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1000 });
  const cache = new Cache();
  cache.set('permanent', 'value');

  t.mock.timers.tick(1000000);

  assert.equal(cache.get('permanent'), 'value');
});

test('Cache stores undefined and null values', () => {
  const cache = new Cache();
  cache.set('emptyValue', undefined);
  cache.set('nullValue', null);

  assert.equal(cache.has('emptyValue'), true);
  assert.equal(cache.get('emptyValue'), undefined);
  assert.equal(cache.has('nullValue'), true);
  assert.equal(cache.get('nullValue'), null);
});
