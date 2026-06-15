const pipe = require('../utils/pipe');

const addOne = (value) => value + 1;
const double = (value) => value * 2;
const toString = (value) => String(value);
const trim = (value) => value.trim();
const toUpperCase = (value) => value.toUpperCase();
const addPrefix = (value) => `Mr. ${value}`;

console.log(pipe(addOne, double)(5));

console.log(pipe()(5));

console.log(pipe(addOne)(5));

console.log(pipe(addOne, double, toString)(5));

console.log(pipe(addPrefix, toUpperCase, trim)('moeez'));

console.log(pipe(addOne, 'invalid', double)(5));

console.log(pipe(
  (user) => user.name,
  toUpperCase
)({ name: 'naveen' }));