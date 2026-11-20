'use strict';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|[+-]\d{2}:\d{2})?$/;
const OPTION_KEYS = new Set(['requireTimezone', 'allowDateOnly']);

/**
 * Validates a strict, extended ISO 8601 date or date-time string.
 *
 * Date-times require seconds and may include 1-9 fractional-second digits and
 * an optional Z or ±HH:mm timezone designator. Timezone-free values remain
 * timezone-free; this function never parses or normalizes the input.
 *
 * @param {*} value
 * @param {{requireTimezone?: boolean, allowDateOnly?: boolean}} [options]
 * @returns {{valid: boolean, type: string|null, error: {type: string, message: string}|null}}
 */
function validateDateTimeFormat(value, options = {}) {
  const normalizedOptions = validateOptions(options);
  if (normalizedOptions.error) return invalid(normalizedOptions.error.type, normalizedOptions.error.message);

  if (typeof value !== 'string') {
    return invalid('invalid_type', 'Value must be a string');
  }

  if (value.length === 0) {
    return invalid('empty', 'Value must not be empty');
  }

  const dateOnlyMatch = DATE_PATTERN.exec(value);
  if (dateOnlyMatch) {
    const dateError = validateCalendarDate(dateOnlyMatch);
    if (dateError) return invalid(dateError.type, dateError.message);
    if (!normalizedOptions.allowDateOnly) {
      return invalid('date_only_not_allowed', 'Date-only values are not allowed');
    }
    return valid('date-only');
  }

  const match = DATE_TIME_PATTERN.exec(value);
  if (!match) {
    return invalid('invalid_format', 'Value must use YYYY-MM-DDTHH:mm:ss with an optional fractional second and timezone');
  }

  const dateError = validateCalendarDate(match);
  if (dateError) return invalid(dateError.type, dateError.message);

  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  if (hour > 23 || minute > 59 || second > 59) {
    return invalid('invalid_time', 'Hour, minute, or second is outside its valid range');
  }

  const timezone = match[8];
  if (timezone && timezone !== 'Z') {
    const offsetHour = Number(timezone.slice(1, 3));
    const offsetMinute = Number(timezone.slice(4, 6));
    if (offsetHour > 14 || offsetMinute > 59 || (offsetHour === 14 && offsetMinute !== 0)) {
      return invalid('invalid_timezone', 'Timezone offset must be between -14:00 and +14:00');
    }
  }

  if (normalizedOptions.requireTimezone && !timezone) {
    return invalid('timezone_required', 'An explicit timezone (Z or ±HH:mm) is required');
  }

  return valid('date-time');
}

function validateOptions(options) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    return { error: { type: 'invalid_options', message: 'Options must be an object' } };
  }

  if (Object.keys(options).some((key) => !OPTION_KEYS.has(key))) {
    return { error: { type: 'invalid_options', message: 'Options contain an unsupported key' } };
  }

  for (const key of OPTION_KEYS) {
    if (options[key] !== undefined && typeof options[key] !== 'boolean') {
      return { error: { type: 'invalid_options', message: `${key} must be a boolean` } };
    }
  }

  return {
    requireTimezone: options.requireTimezone === true,
    allowDateOnly: options.allowDateOnly === true
  };
}

function validateCalendarDate(match) {
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) {
    return { type: 'invalid_date', message: 'Month must be between 01 and 12' };
  }

  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (day < 1 || day > daysInMonth) {
    return { type: 'invalid_date', message: 'Day is not valid for the specified month and year' };
  }

  return null;
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function valid(type) {
  return { valid: true, type, error: null };
}

function invalid(type, message) {
  return { valid: false, type: null, error: { type, message } };
}

module.exports = validateDateTimeFormat;
