const test = require('node:test');
const assert = require('node:assert/strict');

const parseQueryParams = require('../utils/parseQueryParams');

test('parseQueryParams parses key-value pairs with a leading question mark', () => {
  assert.deepEqual(parseQueryParams('?name=moeez&age=22'), { name: 'moeez', age: '22' });
});

test('parseQueryParams parses a query string without a leading question mark', () => {
  assert.deepEqual(parseQueryParams('page=1&limit=10'), { page: '1', limit: '10' });
});

test('parseQueryParams collects repeated keys into arrays', () => {
  assert.deepEqual(parseQueryParams('?tag=js&tag=node&page=1'), {
    tag: ['js', 'node'],
    page: '1',
  });
});

test('parseQueryParams decodes encoded values', () => {
  assert.deepEqual(parseQueryParams('?q=hello%20world&city=New+York'), {
    q: 'hello world',
    city: 'New York',
  });
});

test('parseQueryParams keeps keys that have no value', () => {
  assert.deepEqual(parseQueryParams('?debug&name='), { debug: '', name: '' });
});

test('parseQueryParams returns an empty object for empty or non-string input', () => {
  assert.deepEqual(parseQueryParams(''), {});
  assert.deepEqual(parseQueryParams(null), {});
  assert.deepEqual(parseQueryParams(undefined), {});
  assert.deepEqual(parseQueryParams(42), {});
});
