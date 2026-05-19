/**
 * Split an array into smaller chunks.
 *
 * @param {Array} array
 * @param {number} size
 * @returns {Array}
 */

function chunk(array, size) {
  if (!Array.isArray(array)) {
    return [];
  }

  if (
    typeof size !== 'number' ||
    size <= 0
  ) {
    return [];
  }

  const result = [];

  for (let index = 0; index < array.length; index += size) {
    result.push(
      array.slice(index, index + size)
    );
  }

  return result;
}

module.exports = chunk;