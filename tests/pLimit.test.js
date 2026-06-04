const pLimit = require('../utils/pLimit');

const delay = (value, time) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(value);
  }, time);
});

async function testConcurrencyLimit() {
  const limit = pLimit(2);
  let activeCount = 0;
  let maxActiveCount = 0;

  const tasks = [1, 2, 3, 4].map((value) => limit(async () => {
    activeCount += 1;
    maxActiveCount = Math.max(maxActiveCount, activeCount);

    const result = await delay(value, 50);

    activeCount -= 1;
    return result;
  }));

  const results = await Promise.all(tasks);

  console.log(results);
  console.log(maxActiveCount);
}

async function testSyncTask() {
  const limit = pLimit(1);

  const result = await limit(() => 'sync result');

  console.log(result);
}

async function testRejectedTask() {
  const limit = pLimit(1);

  try {
    await limit(() => Promise.reject(new Error('Task failed')));
  } catch (error) {
    console.log(error.message);
  }
}

async function testQueueContinuesAfterReject() {
  const limit = pLimit(1);

  const results = await Promise.allSettled([
    limit(() => Promise.reject(new Error('First failed'))),
    limit(() => Promise.resolve('second task completed'))
  ]);

  console.log(results[0].status);
  console.log(results[1].value);
}

function testInvalidConcurrency() {
  try {
    pLimit(0);
  } catch (error) {
    console.log(error.message);
  }

  try {
    pLimit(-1);
  } catch (error) {
    console.log(error.message);
  }

  try {
    pLimit(1.5);
  } catch (error) {
    console.log(error.message);
  }
}

async function testInvalidTask() {
  const limit = pLimit(1);

  try {
    await limit('not a function');
  } catch (error) {
    console.log(error.message);
  }
}

async function runTests() {
  await testConcurrencyLimit();
  await testSyncTask();
  await testRejectedTask();
  await testQueueContinuesAfterReject();
  testInvalidConcurrency();
  await testInvalidTask();
}

runTests();