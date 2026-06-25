const deepEqual = require('../utils/deepEqual');

console.log(deepEqual(1, 1));

console.log(deepEqual(1, '1'));

console.log(deepEqual('a', 'a'));

console.log(deepEqual(null, null));

console.log(deepEqual(null, undefined));

console.log(deepEqual({}, {}));

console.log(deepEqual([], []));

console.log(deepEqual([1, 2, 3], [1, 2, 3]));

console.log(deepEqual([1, 2], [2, 1]));

console.log(deepEqual(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 2 } }
));

console.log(deepEqual(
  { a: 1, b: { c: 2 } },
  { a: 1, b: { c: 3 } }
));

console.log(deepEqual(
  { user: { name: 'Naveen', roles: ['student', 'developer'] } },
  { user: { name: 'Naveen', roles: ['student', 'developer'] } }
));

console.log(deepEqual(
  { user: { name: 'Naveen', roles: ['developer', 'student'] } },
  { user: { name: 'Naveen', roles: ['student', 'developer'] } }
));

const firstFunction = () => true;
const secondFunction = () => true;

console.log(deepEqual(firstFunction, firstFunction));

console.log(deepEqual(firstFunction, secondFunction));

const originalObject = {
  a: {
    b: 1
  }
};

deepEqual(originalObject, {
  a: {
    b: 1
  }
});

console.log(originalObject);