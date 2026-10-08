const assert = require('node:assert/strict');
const nodeTest = require('node:test');
const parseCacheControl = require('../utils/parseCacheControl');

if (typeof global.describe === 'undefined') {
  global.describe = nodeTest.describe;
}

if (typeof global.it === 'undefined') {
  global.it = nodeTest.it;
}

describe('parseCacheControl()', () => {
  it('parses standard boolean and numeric directives', () => {
    const result = parseCacheControl('public, max-age=3600, must-revalidate');
    assert.deepEqual(result, {
      public: true,
      maxAge: 3600,
      mustRevalidate: true,
    });
  });

  it('converts hyphenated names to camelCase', () => {
    const result = parseCacheControl('stale-while-revalidate=60, proxy-revalidate, stale-if-error=86400');
    assert.equal(result.staleWhileRevalidate, 60);
    assert.equal(result.proxyRevalidate, true);
    assert.equal(result.staleIfError, 86400);
  });

  it('preserves quoted string values and ignores whitespace', () => {
    const result = parseCacheControl('private="foo=bar", no-transform, s-maxage = 7200');
    assert.deepEqual(result, {
      private: 'foo=bar',
      noTransform: true,
      sMaxage: 7200,
    });
  });

  it('handles empty or invalid input safely', () => {
    assert.deepEqual(parseCacheControl(''), {});
    assert.deepEqual(parseCacheControl('   '), {});
    assert.deepEqual(parseCacheControl(null), {});
    assert.deepEqual(parseCacheControl(undefined), {});
  });

  it('keeps the last value when duplicate directives are present', () => {
    const result = parseCacheControl('max-age=100, max-age=200');
    assert.equal(result.maxAge, 200);
  });
});
