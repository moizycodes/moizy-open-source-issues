const FILE_REQUIRED_ERROR = 'File is required';
const INVALID_FILE_ERROR = 'Invalid file object';
const FILE_SIZE_ERROR = 'File size exceeds maximum limit';
const FILE_TYPE_ERROR = 'File type is not allowed';

/**
 * Checks whether a value looks like a valid file metadata object.
 *
 * @param {*} file
 * @returns {boolean}
 */
const isValidFileObject = (file) => {
  return (
    file &&
    typeof file === 'object' &&
    typeof file.size === 'number' &&
    typeof file.type === 'string'
  );
};

/**
 * Validates uploaded file metadata against configured rules.
 *
 * @param {Object|null} file - File metadata object.
 * @param {Object} options - Validation options.
 * @param {number} options.maxSize - Maximum allowed file size in bytes.
 * @param {string[]} options.allowedTypes - Allowed MIME types.
 * @param {boolean} options.required - Whether a file is required.
 * @returns {{valid: boolean, errors: string[]}}
 */
const validateFile = (file, options = {}) => {
  const {
    maxSize,
    allowedTypes,
    required
  } = options;

  const errors = [];

  if (!file) {
    if (required) {
      errors.push(FILE_REQUIRED_ERROR);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  if (!isValidFileObject(file)) {
    return {
      valid: false,
      errors: [INVALID_FILE_ERROR]
    };
  }

  if (
    typeof maxSize === 'number' &&
    file.size > maxSize
  ) {
    errors.push(FILE_SIZE_ERROR);
  }

  if (
    Array.isArray(allowedTypes) &&
    allowedTypes.length > 0 &&
    !allowedTypes.includes(file.type)
  ) {
    errors.push(FILE_TYPE_ERROR);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

module.exports = validateFile;
