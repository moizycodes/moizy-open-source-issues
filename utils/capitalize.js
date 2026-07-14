/**
 * Capitalize Utility Function
 * ---------------------------
 * Converts the first character of a string
 * to uppercase while leaving the rest unchanged.
 */

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} The string with its first character uppercased.
 *
 * @example
 * capitalize("hello");     // "Hello"
 * capitalize("javascript"); // "Javascript"
 * capitalize("");           // ""
 * capitalize("A");          // "A"
 */
function capitalize(str) {
  // Handle non-string input gracefully
  if (typeof str !== "string") {
    throw new TypeError(`capitalize() expects a string, got ${typeof str}`);
  }

  // Return empty or single-char strings as-is (or uppercased)
  if (str.length === 0) return str;

  // Uppercase first character, leave the rest unchanged
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = capitalize;