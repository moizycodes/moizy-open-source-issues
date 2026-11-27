const test = require('node:test');
const assert = require('node:assert/strict');

const {
  parseQuery,
  stringifyQuery
} = require('../utils/queryString');

test('parseQuery parses a query string with or without a leading question mark', () => {
  assert.deepEqual(parseQuery('?page=1&sort=asc'), { page: '1', sort: 'asc' });
  assert.deepEqual(parseQuery('page=1&sort=asc'), { page: '1', sort: 'asc' });
});

test('parseQuery returns an empty object for an empty query', () => {
  assert.deepEqual(parseQuery(''), {});
  assert.deepEqual(parseQuery('?'), {});
});

test('parseQuery decodes encoded values', () => {
  assert.deepEqual(parseQuery('?name=John%20Doe'), { name: 'John Doe' });
  assert.deepEqual(parseQuery('?search=hello%20world&category=web'), {
    search: 'hello world',
    category: 'web'
  });
});

test('parseQuery gives a key without a value an empty string', () => {
  assert.deepEqual(parseQuery('?active'), { active: '' });
});

test('stringifyQuery builds a query string with a leading question mark', () => {
  assert.equal(stringifyQuery({ page: 1, sort: 'asc' }), '?page=1&sort=asc');
});

test('stringifyQuery returns an empty string for an empty object', () => {
  assert.equal(stringifyQuery({}), '');
});

test('stringifyQuery encodes values', () => {
  assert.equal(stringifyQuery({ name: 'John Doe' }), '?name=John%20Doe');
  assert.equal(
    stringifyQuery({ search: 'hello world', category: 'web' }),
    '?search=hello%20world&category=web'
  );
});

test('stringifyQuery does not mutate the input object', () => {
  const originalObject = {
    page: 1,
    sort: 'asc'
  };

  stringifyQuery(originalObject);

  assert.deepEqual(originalObject, { page: 1, sort: 'asc' });
});
