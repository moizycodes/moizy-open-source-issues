/**
 * @typedef {object} PaginationValidationResult
 * @property {boolean} valid `true` when the response passed every check.
 * @property {string[]} errors Every problem found, always in the same order.
 *   Empty when the response is valid.
 */

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isPositiveInteger = (value) => Number.isSafeInteger(value) && value > 0;

const isNonNegativeInteger = (value) =>
  Number.isSafeInteger(value) && value >= 0;

/**
 * Check one pagination field and record an error if it is missing or invalid.
 *
 * @param {object} pagination The pagination object being validated.
 * @param {string} name Name of the field to check.
 * @param {(value: unknown) => boolean} isValid Returns `true` for valid values.
 * @param {string} requirement Description used in the error message.
 * @param {string[]} errors Array that error messages are added to.
 * @returns {boolean} `true` when the field is present and valid.
 */
const checkField = (pagination, name, isValid, requirement, errors) => {
  const value = pagination[name];
  if (value === undefined) {
    errors.push(`${name} is required`);
    return false;
  }
  if (!isValid(value)) {
    errors.push(`${name} must be ${requirement}`);
    return false;
  }
  return true;
};

/**
 * Validate a paginated API response of the form
 * `{ data: [...], pagination: { page, pageSize, total, totalPages } }`.
 *
 * Every problem is collected instead of stopping at the first one, and errors
 * are always reported in the same order. The response is never modified, and
 * invalid input such as `null` or a string returns an error result instead of
 * throwing.
 *
 * Numbers must be safe integers (`Number.isSafeInteger`), so decimals, numeric
 * strings, `NaN` and `Infinity` are rejected. `page` may exceed `totalPages`
 * only when `totalPages` is `0`, which covers empty datasets.
 *
 * @param {unknown} response The API response to validate.
 * @returns {PaginationValidationResult} The validation result.
 * @example
 * validatePaginationResponse({
 *   data: [{ id: 1 }, { id: 2 }],
 *   pagination: { page: 1, pageSize: 20, total: 42, totalPages: 3 },
 * });
 * // => { valid: true, errors: [] }
 */
function validatePaginationResponse(response) {
  if (!isPlainObject(response)) {
    return { valid: false, errors: ['response must be an object'] };
  }

  const errors = [];
  const { data, pagination } = response;
  const dataIsArray = Array.isArray(data);

  if (data === undefined) {
    errors.push('data is required');
  } else if (!dataIsArray) {
    errors.push('data must be an array');
  }

  if (pagination === undefined) {
    errors.push('pagination is required');
  } else if (!isPlainObject(pagination)) {
    errors.push('pagination must be an object');
  } else {
    const pageIsValid = checkField(
      pagination,
      'page',
      isPositiveInteger,
      'a positive integer',
      errors
    );
    const pageSizeIsValid = checkField(
      pagination,
      'pageSize',
      isPositiveInteger,
      'a positive integer',
      errors
    );
    const totalIsValid = checkField(
      pagination,
      'total',
      isNonNegativeInteger,
      'a non-negative integer',
      errors
    );
    const totalPagesIsValid = checkField(
      pagination,
      'totalPages',
      isNonNegativeInteger,
      'a non-negative integer',
      errors
    );
    const { page, pageSize, total, totalPages } = pagination;

    // Cross-field checks only run when the fields they compare are valid, so
    // one bad value does not also produce misleading follow-up errors.
    if (pageIsValid && totalPagesIsValid && totalPages > 0 && page > totalPages) {
      errors.push('page cannot be greater than totalPages');
    }
    if (dataIsArray && pageSizeIsValid && data.length > pageSize) {
      errors.push('data length cannot exceed pageSize');
    }
    if (
      totalIsValid &&
      pageSizeIsValid &&
      totalPagesIsValid &&
      totalPages !== Math.ceil(total / pageSize)
    ) {
      errors.push('totalPages must equal ceil(total / pageSize)');
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = validatePaginationResponse;
