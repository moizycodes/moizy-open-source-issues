const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'apiKey',
  'creditCard'
];

const MASK_VALUE = '********';

/**
 * Creates a masked copy of data so sensitive fields are safe to log.
 *
 * @param {*} data - The data to scan.
 * @param {string[]} fields - Additional sensitive field names to mask.
 * @returns {*} A new structure with sensitive values masked.
 */
const maskSensitiveData = (data, fields = []) => {
  const sensitiveFields = createSensitiveFieldSet(fields);

  return maskValue(data, sensitiveFields, new WeakMap());
};

/**
 * Builds a case-insensitive lookup for default and custom sensitive fields.
 *
 * @param {string[]} fields
 * @returns {Set<string>}
 */
const createSensitiveFieldSet = (fields) => {
  const customFields = Array.isArray(fields) ? fields : [];
  const allFields = DEFAULT_SENSITIVE_FIELDS.concat(customFields);

  return new Set(
    allFields
      .filter((field) => typeof field === 'string')
      .map((field) => field.toLowerCase())
  );
};

/**
 * Recursively masks arrays and plain objects without mutating the input.
 *
 * @param {*} value
 * @param {Set<string>} sensitiveFields
 * @param {WeakMap<object, object>} seen
 * @returns {*}
 */
const maskValue = (value, sensitiveFields, seen) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  if (Array.isArray(value)) {
    const maskedArray = [];
    seen.set(value, maskedArray);

    value.forEach((item, index) => {
      maskedArray[index] = maskValue(item, sensitiveFields, seen);
    });

    return maskedArray;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const maskedObject = {};
  seen.set(value, maskedObject);

  Object.keys(value).forEach((key) => {
    if (sensitiveFields.has(key.toLowerCase())) {
      maskedObject[key] = MASK_VALUE;
      return;
    }

    maskedObject[key] = maskValue(value[key], sensitiveFields, seen);
  });

  return maskedObject;
};

/**
 * Checks for ordinary object literals that should be traversed.
 *
 * @param {*} value
 * @returns {boolean}
 */
const isPlainObject = (value) => {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

module.exports = maskSensitiveData;
