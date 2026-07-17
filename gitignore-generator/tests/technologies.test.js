const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveTechnology, listSupported } = require('../lib/technologies');

test('resolveTechnology returns content for a supported slug', () => {
  const tech = resolveTechnology('node');
  assert.equal(tech.slug, 'node');
  assert.equal(tech.name, 'Node.js');
  assert.match(tech.content, /node_modules\//);
});

test('resolveTechnology resolves aliases to the canonical slug', () => {
  const tech = resolveTechnology('nodejs');
  assert.equal(tech.slug, 'node');
});

test('resolveTechnology is case-insensitive', () => {
  const tech = resolveTechnology('Node');
  assert.equal(tech.slug, 'node');
});

test('resolveTechnology returns null for an unsupported technology', () => {
  assert.equal(resolveTechnology('unknown'), null);
});

test('listSupported includes the required minimum set', () => {
  const supported = listSupported();
  const required = ['node', 'react', 'nextjs', 'express', 'vscode', 'jetbrains', 'python'];

  for (const slug of required) {
    assert.ok(supported.includes(slug), `expected ${slug} to be supported`);
  }
});
