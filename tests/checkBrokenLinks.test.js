const test = require('node:test');
const assert = require('node:assert/strict');

const checkBrokenLinks = require('../utils/checkBrokenLinks');

// Replaces fetch so the tests never touch the network.
const mockFetch = (t, responses) => t.mock.method(global, 'fetch', async (url) => {
  const response = responses[url];
  if (response instanceof Error) throw response;
  return { status: response };
});

test('checkBrokenLinks marks a URL that responds with 200 as valid', async (t) => {
  mockFetch(t, { 'https://example.com': 200 });

  assert.deepEqual(await checkBrokenLinks(['https://example.com']), [
    { url: 'https://example.com', statusCode: 200, status: 'valid' }
  ]);
});

test('checkBrokenLinks marks a URL that responds with an error status as broken', async (t) => {
  mockFetch(t, { 'https://example.com/missing': 404, 'https://example.com/error': 500 });

  assert.deepEqual(
    await checkBrokenLinks(['https://example.com/missing', 'https://example.com/error']),
    [
      { url: 'https://example.com/missing', statusCode: 404, status: 'broken' },
      { url: 'https://example.com/error', statusCode: 500, status: 'broken' }
    ]
  );
});

test('checkBrokenLinks marks a URL as broken when the request fails', async (t) => {
  mockFetch(t, { 'https://unreachable.example': new Error('getaddrinfo ENOTFOUND') });

  assert.deepEqual(await checkBrokenLinks(['https://unreachable.example']), [
    { url: 'https://unreachable.example', status: 'broken' }
  ]);
});

test('checkBrokenLinks returns results in the same order as the input', async (t) => {
  const fetchMock = mockFetch(t, {
    'https://a.example': 200,
    'https://b.example': new Error('network down'),
    'https://c.example': 200
  });

  const results = await checkBrokenLinks(['https://a.example', 'https://b.example', 'https://c.example']);

  assert.deepEqual(results.map((result) => result.url), [
    'https://a.example',
    'https://b.example',
    'https://c.example'
  ]);
  assert.deepEqual(results.map((result) => result.status), ['valid', 'broken', 'valid']);
  assert.equal(fetchMock.mock.callCount(), 3);
});

test('checkBrokenLinks returns an empty array for an empty list', async (t) => {
  const fetchMock = mockFetch(t, {});

  assert.deepEqual(await checkBrokenLinks([]), []);
  assert.equal(fetchMock.mock.callCount(), 0);
});
