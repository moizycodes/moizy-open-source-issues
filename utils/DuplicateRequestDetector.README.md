# Duplicate Request Detector

A lightweight utility that detects and blocks duplicate requests based on a unique request identifier and a configurable time window.

---

## Problem

Duplicate requests are a common production issue:

- Users double-clicking "Pay Now"
- Repeated form submissions
- Slow networks causing duplicate API calls
- Duplicate order or email operations

This utility helps prevent those mistakes without external dependencies.

---

## Installation

No external libraries are required. Copy or require the module from `utils/DuplicateRequestDetector.js`.

---

## Basic Usage

```javascript
const DuplicateRequestDetector = require('./utils/DuplicateRequestDetector');

const detector = new DuplicateRequestDetector();

detector.isDuplicate('create-order-123'); // false
detector.isDuplicate('create-order-123'); // true
```

---

## With Expiration Window

```javascript
const detector = new DuplicateRequestDetector({ ttl: 5000 });

detector.isDuplicate('create-order-123'); // false
detector.isDuplicate('create-order-123'); // true

// After 5 seconds, the same identifier can be processed again
```

---

## Real-World Example

```javascript
if (detector.isDuplicate(orderId)) {
  throw new Error('Duplicate request detected');
}

processOrder();
```

---

## API

### `new DuplicateRequestDetector(options?)`

| Option | Type | Description |
| --- | --- | --- |
| `ttl` | `number` | Optional TTL in milliseconds. When omitted, entries persist until `clear()` is called. |

### `isDuplicate(requestId)`

Returns `true` when the identifier was already seen within the active TTL window; otherwise records it and returns `false`.

Supported identifier types: `string`, `number`.

Invalid inputs (`null`, `undefined`, empty/whitespace strings, other types) return `false` and are not tracked.

### `clear()`

Removes all tracked identifiers.

### `size()`

Returns the number of active, non-expired tracked identifiers.

---

## Edge Cases

- Empty, null, and invalid request IDs are handled gracefully
- Expired entries are removed automatically
- Memory is cleaned up during duplicate checks to avoid leaks

---

## Tests

```bash
node tests/duplicateRequestDetector.test.js
```

---

## Related Issue

Implements [#104](https://github.com/moizycodes/moizy-open-source-issues/issues/104).
