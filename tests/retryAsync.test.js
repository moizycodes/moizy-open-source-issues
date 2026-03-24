import retryAsync from '../utils/retryAsync.js';
import {
  test,
  assertEquals,
  assertThrows,
  printSummary
} from './test-utils.js';

//  Test 1: should retry and succeed
test('should retry and succeed', async () => {
  let count = 0;

  const fn = async () => {
    count++;
    if (count < 3) {
      throw new Error('fail');
    }
    return 'success';
  };

  const result = await retryAsync(fn, {
    retries: 5,
    delay: 100
  });

  assertEquals(result, 'success');
});

//  Test 2: should throw error after max retries
test('should throw error after max retries', async () => {
  const fn = async () => {
    throw new Error('always fail');
  };

  try {
    await retryAsync(fn, {
      retries: 2,
      delay: 100
    });
  } catch (error) {
    assertEquals(error.message, 'always fail');
    return;
  }

  throw new Error('Expected function to throw');
});

test('should throw error for invalid function', async () => {
  try {
    await retryAsync(null, { retries: 2 });
  } catch (error) {
    assertEquals(error.message, 'asyncFn must be a function');
    return;
  }

  throw new Error('Expected function to throw');
});
// Print summary
printSummary();