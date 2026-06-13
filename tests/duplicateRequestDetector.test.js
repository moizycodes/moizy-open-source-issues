'use strict';

/**
 * Tests for utils/DuplicateRequestDetector.js
 *
 * Run with: node tests/duplicateRequestDetector.test.js
 */

const DuplicateRequestDetector = require('../utils/DuplicateRequestDetector');

let passed = 0;
let failed = 0;

const test = async (name, fn) => {
  try {
    await fn();
    console.log(`  ✔  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✘  ${name}`);
    console.error(`       ${err.message}`);
    failed++;
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message || 'Assertion failed');
};

const assertEquals = (actual, expected, label = '') => {
  if (actual !== expected) {
    throw new Error(
      `${label ? label + ': ' : ''}expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runAsyncTests() {
  console.log('\nTTL expiration');

  await test('allows the same request again after TTL expires', async () => {
    const detector = new DuplicateRequestDetector({ ttl: 50 });

    assertEquals(detector.isDuplicate('create-order-123'), false, 'first call');
    assertEquals(detector.isDuplicate('create-order-123'), true, 'second call');

    await delay(60);

    assertEquals(detector.isDuplicate('create-order-123'), false, 'after ttl');
  });

  await test('removes expired entries from memory', async () => {
    const detector = new DuplicateRequestDetector({ ttl: 50 });

    detector.isDuplicate('order-1');
    detector.isDuplicate('order-2');
    assertEquals(detector.size(), 2, 'size before expiry');

    await delay(60);

    assertEquals(detector.size(), 0, 'size after expiry');
  });

  await test('cleans up expired entries during duplicate checks', async () => {
    const detector = new DuplicateRequestDetector({ ttl: 50 });

    detector.isDuplicate('cleanup-test');
    assertEquals(detector.size(), 1, 'tracked before expiry');

    await delay(60);
    detector.isDuplicate('other-request');

    assertEquals(detector.size(), 1, 'only active entry remains');
    assert(detector.isDuplicate('cleanup-test') === false, 'expired id is not duplicate');
  });
}

async function runSyncTests() {
  console.log('\nBasic duplicate detection');

  await test('returns false on first request and true on duplicate', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate('create-order-123'), false);
    assertEquals(detector.isDuplicate('create-order-123'), true);
  });

  await test('tracks different request identifiers independently', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate('order-a'), false);
    assertEquals(detector.isDuplicate('order-b'), false);
    assertEquals(detector.isDuplicate('order-a'), true);
    assertEquals(detector.isDuplicate('order-b'), true);
  });

  await test('supports numeric request identifiers', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate(42), false);
    assertEquals(detector.isDuplicate(42), true);
    assertEquals(detector.isDuplicate('42'), true);
  });

  console.log('\nTTL configuration');

  await test('keeps entries without expiration when ttl is omitted', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate('persistent-id'), false);
    assertEquals(detector.isDuplicate('persistent-id'), true);
    assertEquals(detector.size(), 1, 'entry remains tracked');
  });

  await test('ignores invalid ttl values and keeps entries persistent', () => {
    const detector = new DuplicateRequestDetector({ ttl: 0 });

    assertEquals(detector.isDuplicate('no-ttl'), false);
    assertEquals(detector.isDuplicate('no-ttl'), true);
    assertEquals(detector.size(), 1, 'entry remains tracked');
  });

  console.log('\nInvalid inputs');

  await test('returns false for null request id', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate(null), false);
    assertEquals(detector.size(), 0, 'null is not tracked');
  });

  await test('returns false for undefined request id', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate(undefined), false);
    assertEquals(detector.size(), 0, 'undefined is not tracked');
  });

  await test('returns false for empty request id', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate(''), false);
    assertEquals(detector.size(), 0, 'empty string is not tracked');
  });

  await test('returns false for whitespace-only request id', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate('   '), false);
    assertEquals(detector.size(), 0, 'whitespace id is not tracked');
  });

  await test('returns false for non-string non-number request ids', () => {
    const detector = new DuplicateRequestDetector();

    assertEquals(detector.isDuplicate({}), false);
    assertEquals(detector.isDuplicate([]), false);
    assertEquals(detector.isDuplicate(true), false);
    assertEquals(detector.size(), 0, 'invalid ids are not tracked');
  });

  console.log('\nclear()');

  await test('removes all tracked identifiers', () => {
    const detector = new DuplicateRequestDetector();

    detector.isDuplicate('order-1');
    detector.isDuplicate('order-2');
    assertEquals(detector.size(), 2, 'size before clear');

    detector.clear();

    assertEquals(detector.size(), 0, 'size after clear');
    assertEquals(detector.isDuplicate('order-1'), false, 'order-1 allowed again');
    assertEquals(detector.isDuplicate('order-2'), false, 'order-2 allowed again');
  });

  console.log('\nMemory management');

  await test('does not grow memory for repeated invalid inputs', () => {
    const detector = new DuplicateRequestDetector();

    for (let i = 0; i < 1000; i++) {
      detector.isDuplicate(null);
      detector.isDuplicate('');
    }

    assertEquals(detector.size(), 0, 'invalid inputs are not stored');
  });

  await test('tracks many unique identifiers without throwing', () => {
    const detector = new DuplicateRequestDetector({ ttl: 1000 });

    for (let i = 0; i < 500; i++) {
      assertEquals(detector.isDuplicate(`request-${i}`), false);
    }

    assertEquals(detector.size(), 500, 'all unique ids tracked');
  });
}

async function main() {
  await runSyncTests();
  await runAsyncTests();

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('─'.repeat(50));

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
