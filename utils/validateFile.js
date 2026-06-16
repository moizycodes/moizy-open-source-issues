/**
 * Validates uploaded file metadata.
 *
 * @param {Object|null} file
 * @param {Object} options
 * @param {number} options.maxSize
 * @param {string[]} options.allowedTypes
 * @param {boolean} options.required
 * @returns {{valid: boolean, errors: string[]}}
 */
function validateFile(file, options = {}) {
  const {
    maxSize,
    allowedTypes,
    required = false,
  } = options;

  const errors = [];

  // Required file validation
  if (!file) {
    if (required) {
      errors.push("File is required");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // File object validation
  if (
    typeof file !== "object" ||
    file.size === undefined ||
    file.type === undefined ||
    file.name === undefined
  ) {
    return {
      valid: false,
      errors: ["Invalid file object"],
    };
  }
  if (
  typeof file !== 'object' ||
  typeof file.name !== 'string' ||
  typeof file.size !== 'number' ||
  typeof file.type !== 'string'
) {
  return {
    valid: false,
    errors: ['Invalid file object']
  };
}

  // File size validation
  if (
    typeof maxSize === "number" &&
    file.size > maxSize
  ) {
    errors.push("File size exceeds maximum limit");
  }

  // MIME type validation
  if (
    Array.isArray(allowedTypes) &&
    allowedTypes.length > 0 &&
    !allowedTypes.includes(file.type)
  ) {
    errors.push("File type is not allowed");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = validateFile;