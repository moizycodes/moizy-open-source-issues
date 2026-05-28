# JavaScript Rate Limiter

A lightweight JavaScript rate limiter that restricts how many requests/actions can occur within a specific time window.

---

## Features

- Request limiting
- Automatic expiration/reset
- Internal timestamp tracking
- Remaining request counter
- Beginner-friendly implementation
- No external libraries

---

## Example

```javascript
const RateLimiter = require('./RateLimiter');

const limiter = new RateLimiter(3, 5000);

console.log(limiter.allow());
```

---

## Constructor

```javascript
new RateLimiter(limit, duration);
```

### Parameters

- `limit` → Maximum number of allowed requests
- `duration` → Time window in milliseconds

---

## Methods

### allow()

Checks whether a request is allowed.

Returns:
- `true` if allowed
- `false` if blocked

### remainingRequests()

Returns the number of requests remaining in the current window.

---

## Edge Cases Handled

- Invalid input values
- Zero/negative limits
- Expired request cleanup
- Rapid repeated calls

---

## Project Structure

```bash
rate-limiter/
├── RateLimiter.js
├── README.md

examples/
└── rateLimiterExample.js

tests/
└── RateLimiter.test.js
```