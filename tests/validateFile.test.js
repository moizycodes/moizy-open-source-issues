'use strict';

const validateFile = require('../utils/validateFile');

let passed = 0;
let failed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✔  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✘  ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

const assertEquals = (actual, expected, label = '') => {
  if (actual !== expected) {
    throw new Error(
      `${label ? `${label}: ` : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
};

console.log('\nValid files');

test('returns valid for a file that meets all requirements', () => {
  const file = {
    name: 'profile.png',
    size: 204800,
    type: 'image/png'
  };

  const result = validateFile(file, {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/png', 'image/jpeg']
  });

  assertEquals(result.valid, true, 'valid');
  assertEquals(result.errors.length, 0, 'errors length');
});

console.log('\nRequired file validation');

test('returns error when file is required but missing', () => {
  const result = validateFile(null, {
    required: true
  });

  assertEquals(result.valid, false, 'valid');

  assert(
    result.errors.includes('File is required'),
    'should contain required file error'
  );
});

console.log('\nFile size validation');

test('returns error when file exceeds maximum size', () => {
  const file = {
    name: 'large.png',
    size: 10 * 1024 * 1024,
    type: 'image/png'
  };

  const result = validateFile(file, {
    maxSize: 5 * 1024 * 1024
  });

  assertEquals(result.valid, false, 'valid');

  assert(
    result.errors.includes('File size exceeds maximum limit'),
    'should contain file size error'
  );
});

console.log('\nMIME type validation');

test('returns error when file type is not allowed', () => {
  const file = {
    name: 'document.pdf',
    size: 1024,
    type: 'application/pdf'
  };

  const result = validateFile(file, {
    allowedTypes: ['image/png', 'image/jpeg']
  });

  assertEquals(result.valid, false, 'valid');

  assert(
    result.errors.includes('File type is not allowed'),
    'should contain file type error'
  );
});

console.log('\nMultiple errors');

test('returns multiple validation errors when applicable', () => {
  const file = {
    name: 'large.pdf',
    size: 10 * 1024 * 1024,
    type: 'application/pdf'
  };

  const result = validateFile(file, {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/png']
  });

  assertEquals(result.valid, false, 'valid');
  assertEquals(result.errors.length, 2, 'error count');
});

console.log('\nEdge cases');

test('returns valid when configuration is empty', () => {
  const file = {
    name: 'profile.png',
    size: 100,
    type: 'image/png'
  };

  const result = validateFile(file);

  assertEquals(result.valid, true, 'valid');
});

test('returns error for invalid file object', () => {
  const result = validateFile({});

  assertEquals(result.valid, false, 'valid');

  assert(
    result.errors.includes('Invalid file object'),
    'should contain invalid file object error'
  );
});

test('handles zero-byte files', () => {
  const file = {
    name: 'empty.png',
    size: 0,
    type: 'image/png'
  };

  const result = validateFile(file, {
    allowedTypes: ['image/png']
  });

  assertEquals(result.valid, true, 'valid');
});

console.log(`\n${'─'.repeat(50)}`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('─'.repeat(50));

if (failed > 0) {
  process.exit(1);
}
