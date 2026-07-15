/**
 * Typed Validation Utility
 *
 * A lightweight, schema-based validation engine that validates input data
 * against defined rules and returns structured results.
 *
 * @example
 * const schema = {
 *   name:  { type: 'string', required: true },
 *   age:   { type: 'number', min: 18 },
 *   email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
 * };
 *
 * const result = validate(schema, { name: 'Alice', age: 17 });
 * // { isValid: false, errors: [{ field: 'age', message: 'Age must be at least 18' }] }
 */

/**
 * Capitalizes the first character of a string for use in error messages.
 * @param {string} str
 * @returns {string}
 */
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Rule handler map.
 *
 * Each handler receives (value, ruleValue, field) and returns:
 *   - a string error message if the rule is violated
 *   - null if the rule passes
 *
 * Handlers intentionally skip undefined/null values so the `required`
 * rule remains the single source of truth for missing-field errors.
 *
 * @type {Object.<string, (value: any, ruleValue: any, field: string) => string|null>}
 */
const ruleHandlers = {
  type: (value, expectedType, field) => {
    if (value === undefined || value === null) return null;
    if (typeof value !== expectedType) {
      return `${capitalize(field)} must be of type ${expectedType}`;
    }
    return null;
  },

  required: (value, isRequired, field) => {
    if (!isRequired) return null;
    if (value === undefined || value === null) {
      return `${capitalize(field)} is required`;
    }
    if (typeof value === "string" && value.trim() === "") {
      return `${capitalize(field)} is required`;
    }
    return null;
  },

  min: (value, minValue, field) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "number" && value < minValue) {
      return `${capitalize(field)} must be at least ${minValue}`;
    }
    return null;
  },

  max: (value, maxValue, field) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "number" && value > maxValue) {
      return `${capitalize(field)} must be at most ${maxValue}`;
    }
    return null;
  },

  minLength: (value, minLen, field) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "string" && value.length < minLen) {
      return `${capitalize(field)} must be at least ${minLen} characters long`;
    }
    return null;
  },

  maxLength: (value, maxLen, field) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "string" && value.length > maxLen) {
      return `${capitalize(field)} must be at most ${maxLen} characters long`;
    }
    return null;
  },

  pattern: (value, regex, field) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "string" && !regex.test(value)) {
      return `${capitalize(field)} has an invalid format`;
    }
    return null;
  },
};

/**
 * Validates a single field's value against its schema rules.
 *
 * @param {string} field - Field name
 * @param {any} value - The value from the data object
 * @param {Object} fieldSchema - The rule set for this field
 * @returns {Array<{field: string, message: string}>}
 */
const validateField = (field, value, fieldSchema) => {
  const errors = [];

  for (const [ruleName, ruleValue] of Object.entries(fieldSchema)) {
    const handler = ruleHandlers[ruleName];

    if (!handler) {
      // Unknown rule types are silently skipped to keep the engine extensible.
      continue;
    }

    const errorMessage = handler(value, ruleValue, field);
    if (errorMessage) {
      errors.push({ field, message: errorMessage });
    }
  }

  return errors;
};

/**
 * Validates input data against a schema definition.
 *
 * Only fields declared in the schema are validated; extra fields in data
 * are ignored. The original data object is never mutated.
 *
 * @param {Object} schema - Validation schema. Keys are field names; values are
 *   rule objects. Supported rules:
 *     - type {string}       — 'string' | 'number' | 'boolean' | 'object'
 *     - required {boolean}  — field must be present and non-empty
 *     - min {number}        — minimum numeric value (inclusive)
 *     - max {number}        — maximum numeric value (inclusive)
 *     - minLength {number}  — minimum string length (inclusive)
 *     - maxLength {number}  — maximum string length (inclusive)
 *     - pattern {RegExp}    — string must match this regular expression
 *
 * @param {Object} data - The input object to validate.
 *
 * @returns {{ isValid: boolean, errors: Array<{field: string, message: string}> }}
 *
 * @example
 * const schema = {
 *   username: { type: 'string', required: true, minLength: 3, maxLength: 20 },
 *   age:      { type: 'number', required: true, min: 18, max: 120 },
 *   email:    { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
 * };
 *
 * const result = validate(schema, { username: 'Al', age: 15 });
 * // {
 * //   isValid: false,
 * //   errors: [
 * //     { field: 'username', message: 'Username must be at least 3 characters long' },
 * //     { field: 'age',      message: 'Age must be at least 18' }
 * //   ]
 * // }
 */
function validate(schema, data) {
  if (!schema || typeof schema !== "object") {
    return { isValid: true, errors: [] };
  }

  // Work on a safe copy reference — never access data directly as undefined
  const safeData = data && typeof data === "object" ? data : {};
  const errors = [];

  for (const [field, fieldSchema] of Object.entries(schema)) {
    if (!fieldSchema || typeof fieldSchema !== "object") continue;

    const value = safeData[field];
    const fieldErrors = validateField(field, value, fieldSchema);
    errors.push(...fieldErrors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = validate;
