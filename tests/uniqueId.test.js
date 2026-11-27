const test = require('node:test');
const assert = require('node:assert/strict');

const uniqueId = require('../utils/uniqueId');

const counterOf = (id) => Number(id.split('_').pop());

test('uniqueId uses the "id" prefix by default', () => {
  assert.match(uniqueId(), /^id_\d+$/);
});

test('uniqueId uses a custom prefix', () => {
  assert.match(uniqueId('user'), /^user_\d+$/);
});

test('uniqueId falls back to the "id" prefix for an empty string', () => {
  assert.match(uniqueId(''), /^id_\d+$/);
});

test('uniqueId increments the counter on every call, whatever the prefix', () => {
  const first = uniqueId();
  const second = uniqueId('user');
  const third = uniqueId();

  assert.equal(counterOf(second), counterOf(first) + 1);
  assert.equal(counterOf(third), counterOf(first) + 2);
});
