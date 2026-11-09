const { test, assertEquals, printSummary } = require("./test-utils.js");
const validateDateRange = require("../utils/validateDateRange.js");

test("accepts a valid ISO date range", () => {
  const result = validateDateRange("2026-09-15", "2026-09-20");
  assertEquals(result.valid, true);
  assertEquals(result.startDate, "2026-09-15");
  assertEquals(result.endDate, "2026-09-20");
  assertEquals(result.durationDays, 5);
});

test("rejects same-day ranges by default", () => {
  const result = validateDateRange("2026-09-15", "2026-09-15");
  assertEquals(result.valid, false);
  assertEquals(result.reason, "Start and end dates must be different");
});

test("allows same-day ranges when configured", () => {
  const result = validateDateRange("2026-09-15", "2026-09-15", { allowSameDay: true });
  assertEquals(result.valid, true);
  assertEquals(result.durationDays, 0);
});

test("rejects a start date after the end date", () => {
  const result = validateDateRange("2026-09-20", "2026-09-15");
  assertEquals(result.valid, false);
  assertEquals(result.reason, "End date must not be before start date");
});

test("rejects invalid start dates", () => {
  assertEquals(validateDateRange("2026-02-30", "2026-03-05").valid, false);
});

test("rejects invalid end dates", () => {
  assertEquals(validateDateRange("2026-09-15", "2026-13-01").valid, false);
});

test("rejects missing start dates", () => {
  assertEquals(validateDateRange(undefined, "2026-09-20").valid, false);
});

test("rejects missing end dates", () => {
  assertEquals(validateDateRange("2026-09-15", undefined).valid, false);
});

test("rejects when both dates are missing", () => {
  assertEquals(validateDateRange(undefined, undefined).valid, false);
});

test("enforces the minimum duration", () => {
  const result = validateDateRange("2026-09-15", "2026-09-16", { minDays: 2 });
  assertEquals(result.valid, false);
  assertEquals(result.reason, "Date range must be at least 2 days");
});

test("accepts the exact minimum duration", () => {
  assertEquals(validateDateRange("2026-09-15", "2026-09-17", { minDays: 2 }).valid, true);
});

test("accepts the exact maximum duration", () => {
  assertEquals(validateDateRange("2026-09-15", "2026-10-15", { maxDays: 30 }).valid, true);
});

test("rejects a range exceeding the maximum duration", () => {
  const result = validateDateRange("2026-09-15", "2026-10-16", { maxDays: 30 });
  assertEquals(result.valid, false);
  assertEquals(result.reason, "Date range must not exceed 30 days");
});

test("validates leap-day dates in leap years", () => {
  assertEquals(validateDateRange("2024-02-28", "2024-03-01").durationDays, 2);
});

test("rejects leap-day dates in non-leap years", () => {
  assertEquals(validateDateRange("2025-02-29", "2025-03-01").valid, false);
});

test("handles month and year boundaries", () => {
  assertEquals(validateDateRange("2025-12-31", "2026-01-02").durationDays, 2);
});

test("rejects ambiguous and non-ISO string formats", () => {
  assertEquals(validateDateRange("09/15/2026", "09/20/2026").valid, false);
  assertEquals(validateDateRange("2026-9-15", "2026-09-20").valid, false);
});

test("accepts valid Date instances without mutating them", () => {
  const start = new Date("2026-09-15T12:00:00.000Z");
  const end = new Date("2026-09-20T12:00:00.000Z");
  const startTime = start.getTime();
  const endTime = end.getTime();

  const result = validateDateRange(start, end);

  assertEquals(result.valid, true);
  assertEquals(result.startDate, "2026-09-15");
  assertEquals(result.endDate, "2026-09-20");
  assertEquals(start.getTime(), startTime);
  assertEquals(end.getTime(), endTime);
});

test("rejects invalid Date instances", () => {
  assertEquals(validateDateRange(new Date("invalid"), new Date()).valid, false);
});

test("rejects invalid option types and values", () => {
  assertEquals(validateDateRange("2026-09-15", "2026-09-20", null).valid, false);
  assertEquals(validateDateRange("2026-09-15", "2026-09-20", { allowSameDay: "yes" }).valid, false);
  assertEquals(validateDateRange("2026-09-15", "2026-09-20", { minDays: -1 }).valid, false);
  assertEquals(validateDateRange("2026-09-15", "2026-09-20", { maxDays: 1.5 }).valid, false);
  assertEquals(validateDateRange("2026-09-15", "2026-09-20", { minDays: 5, maxDays: 2 }).valid, false);
  assertEquals(validateDateRange("2026-09-15", "2026-09-20", { unsupported: true }).valid, false);
});

test("supports a zero-day minimum when same-day ranges are allowed", () => {
  assertEquals(
    validateDateRange("2026-09-15", "2026-09-15", { allowSameDay: true, minDays: 0 }).valid,
    true
  );
});

test("does not mutate input values", () => {
  const start = "2026-09-15";
  const end = "2026-09-20";
  const options = { allowSameDay: false, minDays: 1, maxDays: 30 };
  const originalOptions = { ...options };

  validateDateRange(start, end, options);

  assertEquals(start, "2026-09-15");
  assertEquals(end, "2026-09-20");
  assertEquals(JSON.stringify(options), JSON.stringify(originalOptions));
});

printSummary();
