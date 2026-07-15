const test = require('node:test');
const assert = require('node:assert/strict');
const { generateGitignore } = require('../lib/generate');

test('generates content for a single technology', () => {
  const { content, included, unsupported } = generateGitignore(['node']);

  assert.deepEqual(included, ['Node.js']);
  assert.deepEqual(unsupported, []);
  assert.match(content, /# Node\.js/);
  assert.match(content, /node_modules\//);
});

test('merges multiple technologies without duplicate lines', () => {
  const { content, included } = generateGitignore(['node', 'react']);

  assert.deepEqual(included, ['Node.js', 'React']);

  const lines = content.split('\n').filter((line) => line.length > 0 && !line.startsWith('#'));
  const uniqueLines = new Set(lines);
  assert.equal(lines.length, uniqueLines.size, 'expected no duplicate rule lines');
});

test('treats duplicate arguments as a single technology', () => {
  const { content, included } = generateGitignore(['node', 'node', 'react']);

  assert.deepEqual(included, ['Node.js', 'React']);
  assert.equal(content.match(/# Node\.js/g).length, 1);
});

test('is case-insensitive when deduping and resolving', () => {
  const { included } = generateGitignore(['Node', 'node', 'NODE']);
  assert.deepEqual(included, ['Node.js']);
});

test('reports unsupported technologies and excludes them from content', () => {
  const { content, included, unsupported } = generateGitignore(['node', 'unknown']);

  assert.deepEqual(included, ['Node.js']);
  assert.deepEqual(unsupported, ['unknown']);
  assert.doesNotMatch(content, /unknown/);
});

test('returns empty content when nothing is supported', () => {
  const { content, included, unsupported } = generateGitignore(['unknown']);

  assert.equal(content, '');
  assert.deepEqual(included, []);
  assert.deepEqual(unsupported, ['unknown']);
});
