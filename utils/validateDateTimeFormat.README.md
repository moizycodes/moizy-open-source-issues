# API Date-Time Format Validator

`validateDateTimeFormat(value, options)` validates date and date-time strings without parsing them into JavaScript `Date` objects, converting timezones, or changing the input. It has no external dependencies.

## Usage

```js
const validateDateTimeFormat = require('./utils/validateDateTimeFormat');

const result = validateDateTimeFormat('2026-11-17T10:30:00Z', {
  requireTimezone: true,
  allowDateOnly: false
});

if (!result.valid) {
  console.error(result.error.type, result.error.message);
}
```

## Supported format

Date-times use the strict extended form `YYYY-MM-DDTHH:mm:ss`, with optional 1-9 digit fractional seconds and an optional timezone suffix: `Z` or `±HH:mm`. Hours are 00-23, minutes and seconds are 00-59, and offsets are limited to ±14:00. The date portion is checked against the Gregorian calendar, including leap years.

Date-only values use `YYYY-MM-DD` and are disabled by default. Locale-specific dates, a space instead of `T`, omitted seconds, lowercase separators, and whitespace around the value are not accepted.

## Options

- `requireTimezone` (boolean, default `false`): require an explicit `Z` or numeric offset for date-time values.
- `allowDateOnly` (boolean, default `false`): allow valid date-only values.

Unknown options and non-boolean option values are rejected.

## Result

A valid value returns `{ valid: true, type: 'date-time' | 'date-only', error: null }`. Invalid values return `{ valid: false, type: null, error: { type, message } }`. Error types include `invalid_type`, `empty`, `invalid_format`, `invalid_date`, `invalid_time`, `invalid_timezone`, `timezone_required`, `date_only_not_allowed`, and `invalid_options`.

A timezone-free timestamp is never silently interpreted as UTC. It is accepted as a timezone-free value unless `requireTimezone` is enabled.

## Tests

Run the focused test file with Node.js:

```bash
node tests/validateDateTimeFormat.test.js
```
