const test = require('node:test');
const assert = require('node:assert/strict');

const safeJSONParse = require('../utils/safeJSONParse');

test('safeJSONParse returns parsed data for valid JSON', () => {
  assert.deepEqual(safeJSONParse('{"name":"John","tags":[1,2]}'), {
    data: { name: 'John', tags: [1, 2] },
    error: null,
  });
});

test('safeJSONParse parses JSON primitives', () => {
  assert.deepEqual(safeJSONParse('42'), { data: 42, error: null });
  assert.deepEqual(safeJSONParse('"text"'), { data: 'text', error: null });
  assert.deepEqual(safeJSONParse('null'), { data: null, error: null });
});

test('safeJSONParse reports invalid JSON without throwing', () => {
  assert.deepEqual(safeJSONParse('invalid'), { data: null, error: 'Invalid JSON' });
  assert.deepEqual(safeJSONParse('{"name":'), { data: null, error: 'Invalid JSON' });
});

test('safeJSONParse treats empty and whitespace-only strings as invalid JSON', () => {
  assert.deepEqual(safeJSONParse(''), { data: null, error: 'Invalid JSON' });
  assert.deepEqual(safeJSONParse('   '), { data: null, error: 'Invalid JSON' });
});

test('safeJSONParse rejects input that is not a string', () => {
  const expected = { data: null, error: 'Input must be a string' };

  assert.deepEqual(safeJSONParse(null), expected);
  assert.deepEqual(safeJSONParse(undefined), expected);
  assert.deepEqual(safeJSONParse(42), expected);
  assert.deepEqual(safeJSONParse({ name: 'John' }), expected);
});
