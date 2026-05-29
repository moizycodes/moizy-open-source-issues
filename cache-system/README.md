# Lightweight Cache System

A beginner-friendly in-memory JavaScript cache system with optional TTL (Time To Live) expiration support.

---

## Features

- Store key-value pairs
- Retrieve cached values
- Optional TTL expiration
- Delete individual cached items
- Clear the entire cache
- Check whether a key exists
- Track active cache size
- Handles expired keys gracefully
- Supports null and undefined values
- No external libraries required

---

## Project Structure

```text
cache-system/
├── Cache.js
├── README.md
├── examples/
│   └── cacheExample.js
└── tests/
    └── cache.test.js
```

---

## Basic Usage

```javascript
const Cache = require('./Cache');

const cache = new Cache();

cache.set('user', {
  id: 1,
  name: 'Moeez'
});

console.log(cache.get('user'));
```

---

## TTL Usage

```javascript
cache.set('token', 'abc123', 5000);
```

This stores the value for 5 seconds. After that, the key expires and returns `undefined`.

---

## Available Methods

### set(key, value, ttl)

Stores a value in the cache. The `ttl` argument is optional and is measured in milliseconds.

### get(key)

Returns the cached value if it exists and has not expired. Returns `undefined` if the key does not exist or has expired.

### has(key)

Returns `true` if the key exists and has not expired.

### delete(key)

Deletes a specific key from the cache.

### clear()

Removes all items from the cache.

### size()

Returns the number of active cache items.

---

## Edge Cases Handled

- Non-existing keys
- Expired keys
- Invalid TTL values
- Negative TTL values
- Overwriting existing keys
- Null values
- Undefined values
- Clearing an empty cache

---

## Testing

Run:

```bash
node cache-system/tests/cache.test.js
```

---

## Example

Run:

```bash
node cache-system/examples/cacheExample.js
```

---

## Notes

- Uses JavaScript `Map` internally
- Expired items are removed during access
- Invalid or negative TTL values are handled gracefully by storing values without expiration
- Built using vanilla JavaScript
- No external libraries required