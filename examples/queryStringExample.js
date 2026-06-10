const {
  parseQuery,
  stringifyQuery
} = require('../utils/queryString');

const parsedQuery = parseQuery('?page=1&sort=asc&name=John%20Doe');

console.log(parsedQuery);

const queryString = stringifyQuery({
  page: 2,
  sort: 'desc',
  search: 'open source'
});

console.log(queryString);