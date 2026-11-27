const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const storageManager = require('../utils/storageManager');

const createFakeStorage = () => {
  const items = new Map();
  return {
    items,
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
    clear: () => items.clear(),
  };
};

const setLocalStorage = (value) => {
  Object.defineProperty(globalThis, 'localStorage', {
    value,
    configurable: true,
    writable: true,
  });
};

const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
let storage;

beforeEach(() => {
  storage = createFakeStorage();
  setLocalStorage(storage);
});

afterEach(() => {
  if (originalDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalDescriptor);
  } else {
    delete globalThis.localStorage;
  }
});

test('storageManager stores values as JSON and reads them back', () => {
  storageManager.set('user', { name: 'Moeez', roles: ['admin'] });

  assert.equal(storage.items.get('user'), '{"name":"Moeez","roles":["admin"]}');
  assert.deepEqual(storageManager.get('user'), { name: 'Moeez', roles: ['admin'] });
});

test('storageManager.get returns the default value for a missing key', () => {
  assert.equal(storageManager.get('missing'), null);
  assert.equal(storageManager.get('missing', 'fallback'), 'fallback');
});

test('storageManager.get returns the default value when the stored JSON is invalid', () => {
  storage.items.set('broken', '{not json');

  assert.equal(storageManager.get('broken', 'fallback'), 'fallback');
});

test('storageManager.remove deletes only the given key', () => {
  storageManager.set('a', 1);
  storageManager.set('b', 2);

  storageManager.remove('a');

  assert.equal(storageManager.get('a'), null);
  assert.equal(storageManager.get('b'), 2);
});

test('storageManager.clear removes every item', () => {
  storageManager.set('a', 1);
  storageManager.set('b', 2);

  storageManager.clear();

  assert.equal(storage.items.size, 0);
});

test('storageManager rejects keys that are not non-empty strings', () => {
  assert.throws(() => storageManager.set('', 1), TypeError);
  assert.throws(() => storageManager.get('   '), TypeError);
  assert.throws(() => storageManager.remove(42), TypeError);
});

test('storageManager ignores errors thrown by localStorage', () => {
  const quotaError = () => {
    throw new Error('QuotaExceededError');
  };
  setLocalStorage({ getItem: quotaError, setItem: quotaError, removeItem: quotaError, clear: quotaError });

  assert.doesNotThrow(() => storageManager.set('key', 'value'));
  assert.equal(storageManager.get('key', 'fallback'), 'fallback');
  assert.doesNotThrow(() => storageManager.remove('key'));
  assert.doesNotThrow(() => storageManager.clear());
});

test('storageManager does nothing when localStorage is unavailable', () => {
  setLocalStorage(undefined);

  assert.doesNotThrow(() => storageManager.set('key', 'value'));
  assert.equal(storageManager.get('key', 'fallback'), 'fallback');
  assert.doesNotThrow(() => storageManager.remove('key'));
  assert.doesNotThrow(() => storageManager.clear());
});
