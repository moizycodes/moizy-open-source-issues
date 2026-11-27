const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const sanitizeFileName = require('../utils/sanitizeFileName');

describe('sanitizeFileName utility', () => {
  test('handles standard filenames', () => {
    assert.equal(sanitizeFileName('report.pdf'), 'report.pdf');
  });

  test('normalizes leading/trailing whitespace and spaces between words', () => {
    assert.equal(sanitizeFileName('  My Project (Final)!!.pdf '), 'my-project-final.pdf');
  });

  test('normalizes special characters and symbols', () => {
    assert.equal(sanitizeFileName('Product Image #01 (Final).PNG'), 'product-image-01-final.png');
  });

  test('replaces path separators / and \\ to prevent directory traversal', () => {
    assert.equal(sanitizeFileName('../../etc/passwd.txt'), 'etc-passwd.txt');
    assert.equal(sanitizeFileName('C:\\Windows\\system32\\calc.exe'), 'c-windows-system32-calc.exe');
  });

  test('normalizes multiple consecutive separators and dots', () => {
    assert.equal(sanitizeFileName('my---file...name.pdf'), 'my-file.name.pdf');
  });

  test('handles Unicode accents and characters safely', () => {
    assert.equal(sanitizeFileName('résumé_détaillé 2026.docx'), 'resume_detaille-2026.docx');
  });

  test('preserves hidden files', () => {
    assert.equal(sanitizeFileName('.gitignore'), '.gitignore');
    assert.equal(sanitizeFileName('.env.local'), '.env.local');
  });

  test('handles filenames without extensions', () => {
    assert.equal(sanitizeFileName('README'), 'readme');
  });

  test('handles empty or non-string inputs safely', () => {
    assert.equal(sanitizeFileName(''), 'unnamed-file');
    assert.equal(sanitizeFileName('   '), 'unnamed-file');
    assert.equal(sanitizeFileName(null), 'unnamed-file');
    assert.equal(sanitizeFileName(undefined), 'unnamed-file');
  });

  test('enforces custom maximum length', () => {
    const longName = 'a'.repeat(300) + '.txt';
    const sanitized = sanitizeFileName(longName, { maxLength: 20 });
    assert.ok(sanitized.length <= 20);
    assert.equal(sanitized.endsWith('.txt'), true);
  });

  test('supports custom replacement character', () => {
    assert.equal(sanitizeFileName('hello world image.png', { replacement: '_' }), 'hello_world_image.png');
  });

  test('does not mutate original input string', () => {
    const input = ' Test File #1.PDF ';
    const copy = input;
    sanitizeFileName(input);
    assert.equal(input, copy);
  });
});
