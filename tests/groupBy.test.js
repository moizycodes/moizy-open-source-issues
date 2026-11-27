const test = require('node:test');
const assert = require('node:assert/strict');

const groupBy = require('../utils/groupBy');

const users = [
  { name: 'Ali', role: 'admin' },
  { name: 'Moeez', role: 'user' },
  { name: 'Ahmed', role: 'admin' }
];

const usersByRole = {
  admin: [
    { name: 'Ali', role: 'admin' },
    { name: 'Ahmed', role: 'admin' }
  ],
  user: [{ name: 'Moeez', role: 'user' }]
};

test('groupBy groups items by a property name', () => {
  assert.deepEqual(groupBy(users, 'role'), usersByRole);
});

test('groupBy groups items by a callback', () => {
  assert.deepEqual(groupBy(users, (user) => user.role), usersByRole);
});

test('groupBy returns an empty object for an empty array or a non-array', () => {
  assert.deepEqual(groupBy([], 'role'), {});
  assert.deepEqual(groupBy(null, 'role'), {});
  assert.deepEqual(groupBy('users', 'role'), {});
});

test('groupBy returns an empty object when the key is not a property name or function', () => {
  assert.deepEqual(groupBy(users, null), {});
  assert.deepEqual(groupBy(users, {}), {});
});

test('groupBy puts items without the property under "undefined"', () => {
  assert.deepEqual(groupBy(users, 'missing'), { undefined: users });
  assert.deepEqual(groupBy([{ name: 'Item 1' }, { name: 'Item 2' }], () => undefined), {
    undefined: [{ name: 'Item 1' }, { name: 'Item 2' }]
  });
});

test('groupBy converts boolean group keys to strings', () => {
  const items = [
    { name: 'A', active: true },
    { name: 'B', active: false },
    { name: 'C', active: true }
  ];

  assert.deepEqual(groupBy(items, (item) => item.active), {
    true: [items[0], items[2]],
    false: [items[1]]
  });
});

test('groupBy accepts a numeric property name', () => {
  const items = [{ 0: 'A' }, { 0: 'B' }, { 1: 'C' }];

  assert.deepEqual(groupBy(items, 0), {
    A: [items[0]],
    B: [items[1]],
    undefined: [items[2]]
  });
});

test('groupBy treats "constructor" and "__proto__" as ordinary group names', () => {
  const items = [
    { key: 'constructor', val: 1 },
    { key: '__proto__', val: 2 }
  ];

  const result = groupBy(items, (item) => item.key);

  assert.deepEqual(Object.keys(result), ['constructor', '__proto__']);
  assert.deepEqual(result.constructor, [items[0]]);
  assert.deepEqual(Object.getOwnPropertyDescriptor(result, '__proto__').value, [items[1]]);
  assert.equal(Object.getPrototypeOf(result), Object.prototype);
});

test('groupBy does not mutate the input array', () => {
  const input = [{ name: 'Ali', role: 'admin' }];

  groupBy(input, 'role');

  assert.deepEqual(input, [{ name: 'Ali', role: 'admin' }]);
});
