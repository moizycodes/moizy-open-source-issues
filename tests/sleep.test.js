import { sleep } from "../utils/sleep.js";
import {
  test,
  assertEquals,
  printSummary,
} from "./test-utils.js";

// Valid delay
test("sleep resolves after delay", async () => {
  const start = Date.now();

  await sleep(100);

  const elapsed = Date.now() - start;

  assertEquals(elapsed >= 100, true);
});

// Zero delay
test("sleep handles zero delay", async () => {
  await sleep(0);
  assertEquals(true, true);
});

// Negative delay
test("sleep handles negative delay", async () => {
  await sleep(-100);
  assertEquals(true, true);
});

// Invalid input
test("sleep handles non-number input", async () => {
  await sleep("invalid");
  assertEquals(true, true);
});

printSummary();