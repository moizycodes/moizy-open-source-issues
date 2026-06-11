const test = require('node:test');
const assert = require('node:assert/strict');

const maskSensitiveData = require('../utils/maskSensitiveData');

test('maskSensitiveData masks default sensitive fields', () => {
  const user = {
    email: 'john@example.com',
    password: 'secret123',
    token: 'abc123',
    creditCard: '4111111111111111'
  };

  const result = maskSensitiveData(user);

  assert.deepEqual(result, {
    email: 'john@example.com',
    password: '********',
    token: '********',
    creditCard: '********'
  });
});

test('maskSensitiveData handles nested objects', () => {
  const payload = {
    user: {
      profile: {
        name: 'John',
        password: 'secret123'
      },
      auth: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      }
    }
  };

  const result = maskSensitiveData(payload);

  assert.deepEqual(result, {
    user: {
      profile: {
        name: 'John',
        password: '********'
      },
      auth: {
        accessToken: '********',
        refreshToken: '********'
      }
    }
  });
});

test('maskSensitiveData handles arrays with nested objects', () => {
  const payload = {
    users: [
      {
        id: 1,
        profile: {
          token: 'abc123'
        }
      },
      {
        id: 2,
        apiKey: 'api-key'
      }
    ]
  };

  const result = maskSensitiveData(payload);

  assert.deepEqual(result, {
    users: [
      {
        id: 1,
        profile: {
          token: '********'
        }
      },
      {
        id: 2,
        apiKey: '********'
      }
    ]
  });
});

test('maskSensitiveData supports custom sensitive fields', () => {
  const employee = {
    name: 'Jane',
    salary: 90000,
    nationalId: '123-45-6789'
  };

  const result = maskSensitiveData(employee, ['salary', 'nationalId']);

  assert.deepEqual(result, {
    name: 'Jane',
    salary: '********',
    nationalId: '********'
  });
});

test('maskSensitiveData does not mutate the original data', () => {
  const payload = {
    user: {
      password: 'secret123',
      sessions: [
        {
          token: 'abc123'
        }
      ]
    }
  };
  const originalPayload = JSON.parse(JSON.stringify(payload));

  const result = maskSensitiveData(payload);

  assert.deepEqual(payload, originalPayload);
  assert.notStrictEqual(result, payload);
  assert.notStrictEqual(result.user, payload.user);
  assert.notStrictEqual(result.user.sessions, payload.user.sessions);
});

test('maskSensitiveData handles null values, empty objects, and primitives', () => {
  assert.deepEqual(maskSensitiveData({ password: null }), {
    password: '********'
  });
  assert.deepEqual(maskSensitiveData({}), {});
  assert.equal(maskSensitiveData(null), null);
  assert.equal(maskSensitiveData('visible'), 'visible');
});

test('maskSensitiveData handles deeply nested mixed arrays and objects', () => {
  const payload = {
    users: [
      {
        profile: {
          auth: {
            credentials: {
              secret: 'hidden'
            }
          }
        }
      }
    ]
  };

  const result = maskSensitiveData(payload);

  assert.deepEqual(result, {
    users: [
      {
        profile: {
          auth: {
            credentials: {
              secret: '********'
            }
          }
        }
      }
    ]
  });
});
