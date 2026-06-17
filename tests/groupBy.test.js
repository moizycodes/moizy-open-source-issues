const groupBy = require('../utils/groupBy');

const users = [
  { name: 'Ali', role: 'admin' },
  { name: 'Moeez', role: 'user' },
  { name: 'Ahmed', role: 'admin' }
];

console.log(groupBy(users, 'role'));

console.log(groupBy(users, (user) => user.role));

console.log(groupBy([], 'role'));

console.log(groupBy(null, 'role'));

console.log(groupBy(users, 'missing'));

const mixedItems = [
  { value: 1, type: 'number' },
  { value: 'hello', type: 'string' },
  { value: true, type: 'boolean' }
];

console.log(groupBy(mixedItems, 'type'));

const callbackUndefined = [
  { name: 'Item 1' },
  { name: 'Item 2' }
];

console.log(groupBy(callbackUndefined, () => undefined));

console.log(users);