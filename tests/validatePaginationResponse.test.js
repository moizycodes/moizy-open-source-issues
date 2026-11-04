const assert = require('node:assert/strict');
const { test } = require('node:test');
const validatePaginationResponse = require('../src/utils/validatePaginationResponse');

const makeResponse = ({ dataLength = 20, ...pagination } = {}) => ({
  data: Array.from({ length: dataLength }, (_, index) => ({ id: index + 1 })),
  pagination: { page: 1, pageSize: 20, total: 42, totalPages: 3, ...pagination },
});

const VALID = { valid: true, errors: [] };

const deepFreeze = (value) => {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

test('accepts the valid example from the issue', () => {
  const response = {
    data: [{ id: 1 }, { id: 2 }],
    pagination: { page: 1, pageSize: 20, total: 42, totalPages: 3 },
  };

  assert.deepEqual(validatePaginationResponse(response), VALID);
});

test('reports the invalid example from the issue with both errors in order', () => {
  const response = {
    data: new Array(25),
    pagination: { page: 5, pageSize: 20, total: 42, totalPages: 3 },
  };

  assert.deepEqual(validatePaginationResponse(response), {
    valid: false,
    errors: [
      'page cannot be greater than totalPages',
      'data length cannot exceed pageSize',
    ],
  });
});

test('accepts a valid first page', () => {
  assert.deepEqual(validatePaginationResponse(makeResponse({ page: 1 })), VALID);
});

test('accepts a valid middle page', () => {
  assert.deepEqual(validatePaginationResponse(makeResponse({ page: 2 })), VALID);
});

test('accepts a valid final page with fewer items than pageSize', () => {
  assert.deepEqual(
    validatePaginationResponse(makeResponse({ page: 3, dataLength: 2 })),
    VALID
  );
});

test('accepts an empty dataset', () => {
  const response = {
    data: [],
    pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
  };

  assert.deepEqual(validatePaginationResponse(response), VALID);
});

test('reports missing data', () => {
  const { pagination } = makeResponse();

  assert.deepEqual(validatePaginationResponse({ pagination }), {
    valid: false,
    errors: ['data is required'],
  });
});

test('reports data that is not an array', () => {
  for (const data of [null, {}, 'items', 3]) {
    const response = { ...makeResponse(), data };

    assert.deepEqual(validatePaginationResponse(response), {
      valid: false,
      errors: ['data must be an array'],
    });
  }
});

test('reports a missing pagination object', () => {
  assert.deepEqual(validatePaginationResponse({ data: [] }), {
    valid: false,
    errors: ['pagination is required'],
  });
});

test('reports a pagination value that is not an object', () => {
  for (const pagination of [null, [], 'page=1', 1]) {
    assert.deepEqual(validatePaginationResponse({ data: [], pagination }), {
      valid: false,
      errors: ['pagination must be an object'],
    });
  }
});

test('reports each missing pagination field', () => {
  for (const field of ['page', 'pageSize', 'total', 'totalPages']) {
    const response = makeResponse();
    delete response.pagination[field];

    assert.deepEqual(validatePaginationResponse(response), {
      valid: false,
      errors: [`${field} is required`],
    });
  }
});

test('reports negative values', () => {
  const response = makeResponse({
    page: -1,
    pageSize: -20,
    total: -42,
    totalPages: -3,
  });

  assert.deepEqual(validatePaginationResponse(response), {
    valid: false,
    errors: [
      'page must be a positive integer',
      'pageSize must be a positive integer',
      'total must be a non-negative integer',
      'totalPages must be a non-negative integer',
    ],
  });
});

test('reports decimal values', () => {
  const response = makeResponse({
    page: 1.5,
    pageSize: 20.5,
    total: 42.1,
    totalPages: 3.2,
  });

  assert.deepEqual(validatePaginationResponse(response), {
    valid: false,
    errors: [
      'page must be a positive integer',
      'pageSize must be a positive integer',
      'total must be a non-negative integer',
      'totalPages must be a non-negative integer',
    ],
  });
});

test('rejects numeric strings, NaN, Infinity and null', () => {
  for (const value of ['1', NaN, Infinity, null]) {
    assert.deepEqual(validatePaginationResponse(makeResponse({ page: value })), {
      valid: false,
      errors: ['page must be a positive integer'],
    });
  }
});

test('reports a page of zero', () => {
  assert.deepEqual(validatePaginationResponse(makeResponse({ page: 0 })), {
    valid: false,
    errors: ['page must be a positive integer'],
  });
});

test('reports a pageSize of zero', () => {
  assert.deepEqual(validatePaginationResponse(makeResponse({ pageSize: 0 })), {
    valid: false,
    errors: ['pageSize must be a positive integer'],
  });
});

test('reports page greater than totalPages', () => {
  assert.deepEqual(validatePaginationResponse(makeResponse({ page: 4 })), {
    valid: false,
    errors: ['page cannot be greater than totalPages'],
  });
});

test('reports incorrect totalPages', () => {
  assert.deepEqual(validatePaginationResponse(makeResponse({ totalPages: 2 })), {
    valid: false,
    errors: ['totalPages must equal ceil(total / pageSize)'],
  });
});

test('reports data length greater than pageSize', () => {
  assert.deepEqual(validatePaginationResponse(makeResponse({ dataLength: 21 })), {
    valid: false,
    errors: ['data length cannot exceed pageSize'],
  });
});

test('reports totalPages that is not zero when total is zero', () => {
  const response = {
    data: [],
    pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1 },
  };

  assert.deepEqual(validatePaginationResponse(response), {
    valid: false,
    errors: ['totalPages must equal ceil(total / pageSize)'],
  });
});

test('accepts a pageSize of 1', () => {
  const response = makeResponse({
    page: 7,
    pageSize: 1,
    total: 7,
    totalPages: 7,
    dataLength: 1,
  });

  assert.deepEqual(validatePaginationResponse(response), VALID);
});

test('accepts large datasets', () => {
  const response = makeResponse({
    page: 50000,
    pageSize: 100,
    total: 5000000,
    totalPages: 50000,
    dataLength: 100,
  });

  assert.deepEqual(validatePaginationResponse(response), VALID);
});

test('handles completely invalid input without throwing', () => {
  for (const input of [undefined, null, 'response', 42, true, [], () => {}]) {
    assert.deepEqual(validatePaginationResponse(input), {
      valid: false,
      errors: ['response must be an object'],
    });
  }
});

test('returns all errors together in a fixed order', () => {
  const response = {
    data: 'not-an-array',
    pagination: { page: 0, pageSize: 20, total: 42, totalPages: 9 },
  };

  assert.deepEqual(validatePaginationResponse(response), {
    valid: false,
    errors: [
      'data must be an array',
      'page must be a positive integer',
      'totalPages must equal ceil(total / pageSize)',
    ],
  });
});

test('returns the same result for the same input', () => {
  const response = makeResponse({ page: 9, pageSize: 0, totalPages: -1 });

  assert.deepEqual(
    validatePaginationResponse(response),
    validatePaginationResponse(response)
  );
});

test('does not mutate the response', () => {
  const response = deepFreeze(makeResponse({ page: 4, dataLength: 25 }));
  const snapshot = JSON.parse(JSON.stringify(response));

  validatePaginationResponse(response);

  assert.deepEqual(JSON.parse(JSON.stringify(response)), snapshot);
});
