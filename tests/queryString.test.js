const {
  parseQuery,
  stringifyQuery
} = require('../utils/queryString');

console.log(parseQuery('?page=1&sort=asc'));
console.log(parseQuery('page=1&sort=asc'));
console.log(parseQuery(''));
console.log(parseQuery('?'));
console.log(parseQuery('?name=John%20Doe'));
console.log(parseQuery('?active'));
console.log(parseQuery('?search=hello%20world&category=web'));

console.log(stringifyQuery({
  page: 1,
  sort: 'asc'
}));

console.log(stringifyQuery({}));
console.log(stringifyQuery({
  name: 'John Doe'
}));

console.log(stringifyQuery({
  search: 'hello world',
  category: 'web'
}));

const originalObject = {
  page: 1,
  sort: 'asc'
};

stringifyQuery(originalObject);

console.log(originalObject);