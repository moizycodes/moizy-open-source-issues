import { test, assertEquals, assert, printSummary } from './test-utils.js';
import { deepFreeze } from '../utils/deepFreeze.js';

// Basic nested object freeze
test('deepFreeze freezes nested objects', () => {
  const config = {
    api: {
      baseUrl: '/api'
    }
  };

  const frozen = deepFreeze(config);

  assertEquals(frozen, config, 'returns the same object');
  assertEquals(Object.isFrozen(config), true, 'top-level is frozen');
  assertEquals(Object.isFrozen(config.api), true, 'nested object is frozen');
});

// Arrays inside objects
test('deepFreeze freezes arrays inside objects', () => {
  const data = {
    users: [{ name: 'Moeez' }, { name: 'Alice' }]
  };

  deepFreeze(data);

  assertEquals(Object.isFrozen(data), true, 'object is frozen');
  assertEquals(Object.isFrozen(data.users), true, 'array is frozen');
  assertEquals(Object.isFrozen(data.users[0]), true, 'nested object in array is frozen');
});

// Null value
test('deepFreeze handles null values', () => {
  const result = deepFreeze(null);
  assertEquals(result, null);
});

// Primitive values
test('deepFreeze handles primitive values', () => {
  assertEquals(deepFreeze(42), 42);
  assertEquals(deepFreeze('hello'), 'hello');
  assertEquals(deepFreeze(true), true);
  assertEquals(deepFreeze(undefined), undefined);
});

// Already frozen object
test('deepFreeze handles already frozen objects', () => {
  const obj = { name: 'test' };
  Object.freeze(obj);

  const result = deepFreeze(obj);
  assertEquals(Object.isFrozen(result), true);
  assertEquals(result, obj);
});

// Circular reference
test('deepFreeze handles circular references', () => {
  const obj = { name: 'test' };
  obj.self = obj;

  const frozen = deepFreeze(obj);

  assertEquals(frozen.self === frozen, true, 'circular reference is preserved');
  assertEquals(Object.isFrozen(frozen), true, 'object is frozen');
});

// Deep nested structure
test('deepFreeze freezes deeply nested structures', () => {
  const config = {
    level1: {
      level2: {
        level3: {
          level4: {
            value: 'deep'
          }
        }
      }
    }
  };

  deepFreeze(config);

  assertEquals(Object.isFrozen(config.level1), true);
  assertEquals(Object.isFrozen(config.level1.level2), true);
  assertEquals(Object.isFrozen(config.level1.level2.level3), true);
  assertEquals(Object.isFrozen(config.level1.level2.level3.level4), true);
});

// Array with nested arrays
test('deepFreeze freezes nested arrays', () => {
  const data = [
    [1, 2, 3],
    [4, 5, 6]
  ];

  deepFreeze(data);

  assertEquals(Object.isFrozen(data), true);
  assertEquals(Object.isFrozen(data[0]), true);
  assertEquals(Object.isFrozen(data[1]), true);
});

// Mixed structures
test('deepFreeze freezes mixed nested structures', () => {
  const complex = {
    users: [
      {
        name: 'Alice',
        roles: ['admin', 'user']
      },
      {
        name: 'Bob',
        roles: ['user']
      }
    ],
    settings: {
      theme: 'dark',
      notifications: {
        email: true,
        push: false
      }
    }
  };

  deepFreeze(complex);

  assertEquals(Object.isFrozen(complex), true);
  assertEquals(Object.isFrozen(complex.users), true);
  assertEquals(Object.isFrozen(complex.users[0]), true);
  assertEquals(Object.isFrozen(complex.users[0].roles), true);
  assertEquals(Object.isFrozen(complex.settings), true);
  assertEquals(Object.isFrozen(complex.settings.notifications), true);
});

// Mutation prevention
test('deepFreeze prevents mutations on nested properties', () => {
  const data = {
    config: {
      api: {
        url: 'https://api.example.com'
      }
    }
  };

  deepFreeze(data);

  // These mutations should fail silently or throw in strict mode
  try {
    data.config.api.url = 'https://new.example.com';
  } catch (err) {
    // In strict mode, this throws. That's fine - the mutation was prevented.
  }

  assertEquals(data.config.api.url, 'https://api.example.com', 'mutation was prevented');
});

// Empty object
test('deepFreeze handles empty objects', () => {
  const obj = {};
  const frozen = deepFreeze(obj);

  assertEquals(Object.isFrozen(frozen), true);
  assertEquals(frozen, obj);
});

// Empty array
test('deepFreeze handles empty arrays', () => {
  const arr = [];
  const frozen = deepFreeze(arr);

  assertEquals(Object.isFrozen(frozen), true);
  assertEquals(frozen, arr);
});

// Print results
printSummary();
