/**
 * Shuffles the elements of an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The same array with its elements in random order.
 */
function shuffle(array) {
  if (!Array.isArray(array)) {
    throw new TypeError("Expected an array");
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = shuffle;