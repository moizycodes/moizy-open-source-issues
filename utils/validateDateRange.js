const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const OPTION_KEYS = new Set(["allowSameDay", "minDays", "maxDays"]);

/**
 * Validates a date range using strict calendar-date parsing.
 *
 * String inputs must use YYYY-MM-DD. Date instances are interpreted by their
 * UTC calendar date. The default behavior rejects same-day ranges and requires
 * at least one day between the dates.
 *
 * @param {string|Date} startDate - Inclusive start date.
 * @param {string|Date} endDate - Inclusive end date.
 * @param {{allowSameDay?: boolean, minDays?: number, maxDays?: number}} [options]
 * @returns {{valid: true, startDate: string, endDate: string, durationDays: number}|{valid: false, reason: string}}
 *
 * @example
 * validateDateRange("2026-09-15", "2026-09-20", { maxDays: 30 });
 * // { valid: true, startDate: "2026-09-15", endDate: "2026-09-20", durationDays: 5 }
 */
function validateDateRange(startDate, endDate, options = {}) {
  if (
    options === null ||
    typeof options !== "object" ||
    Array.isArray(options) ||
    Object.keys(options).some((key) => !OPTION_KEYS.has(key))
  ) {
    return { valid: false, reason: "Options must be an object with supported keys" };
  }

  const allowSameDay = options.allowSameDay === undefined ? false : options.allowSameDay;

  if (typeof allowSameDay !== "boolean") {
    return { valid: false, reason: "allowSameDay must be a boolean" };
  }

  const minDays = options.minDays === undefined ? (allowSameDay ? 0 : 1) : options.minDays;
  const maxDays = options.maxDays;

  if (!Number.isInteger(minDays) || minDays < 0) {
    return { valid: false, reason: "minDays must be a non-negative integer" };
  }

  if (maxDays !== undefined && (!Number.isInteger(maxDays) || maxDays < 0)) {
    return { valid: false, reason: "maxDays must be a non-negative integer" };
  }

  if (maxDays !== undefined && maxDays < minDays) {
    return { valid: false, reason: "maxDays must be greater than or equal to minDays" };
  }

  const parsedStart = parseDate(startDate);
  if (!parsedStart) {
    return { valid: false, reason: "startDate must be a valid YYYY-MM-DD string or Date" };
  }

  const parsedEnd = parseDate(endDate);
  if (!parsedEnd) {
    return { valid: false, reason: "endDate must be a valid YYYY-MM-DD string or Date" };
  }

  const durationDays = (parsedEnd.timestamp - parsedStart.timestamp) / DAY_IN_MILLISECONDS;

  if (durationDays < 0) {
    return { valid: false, reason: "End date must not be before start date" };
  }

  if (durationDays === 0 && !allowSameDay) {
    return { valid: false, reason: "Start and end dates must be different" };
  }

  if (durationDays < minDays) {
    return { valid: false, reason: `Date range must be at least ${minDays} days` };
  }

  if (maxDays !== undefined && durationDays > maxDays) {
    return { valid: false, reason: `Date range must not exceed ${maxDays} days` };
  }

  return {
    valid: true,
    startDate: parsedStart.value,
    endDate: parsedEnd.value,
    durationDays
  };
}

/**
 * Parses a strict ISO calendar date or a Date instance into a UTC day.
 *
 * @param {string|Date} value
 * @returns {{value: string, timestamp: number}|null}
 */
function parseDate(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;

    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return parseDate(`${String(year).padStart(4, "0")}-${month}-${day}`);
  }

  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return { value, timestamp };
}

module.exports = validateDateRange;
