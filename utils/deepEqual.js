/**
 * Compares two values to check whether they are deeply equal.
 *
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === null || b === null) {
    return a === b;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a !== 'object') {
    return false;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    return compareArrays(a, b);
  }

  return compareObjects(a, b);
}

/**
 * Compares two arrays recursively.
 *
 * @param {Array} a
 * @param {Array} b
 * @returns {boolean}
 */
function compareArrays(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  return a.every((item, index) => {
    return deepEqual(item, b[index]);
  });
}

/**
 * Compares two objects recursively.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
function compareObjects(a, b) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => {
    return Object.prototype.hasOwnProperty.call(b, key) &&
      deepEqual(a[key], b[key]);
  });
}

module.exports = deepEqual;