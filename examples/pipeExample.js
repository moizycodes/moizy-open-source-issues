const pipe = require('../utils/pipe');

const addPrefix = (name) => `Mr. ${name}`;
const toUpperCase = (name) => name.toUpperCase();
const trim = (name) => name.trim();

const transformName = pipe(
  addPrefix,
  toUpperCase,
  trim
);

console.log(transformName('moeez'));