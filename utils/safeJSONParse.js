/**
 * Safely parses a JSON string without throwing runtime errors.
 *
 * @param {string} jsonString - The JSON string to parse
 * @returns {{ data: any, error: string | null }}
 *
 * @example
 * safeJSONParse('{"name":"John"}')
 * // { data: { name: "John" }, error: null }
 *
 * safeJSONParse("invalid")
 * // { data: null, error: "Invalid JSON" }
 */
function safeJSONParse(jsonString) {
  try {
    if (typeof jsonString !== "string") {
      return { data: null, error: "Input must be a string" };
    }

    if (jsonString.trim() === "") {
      return { data: null, error: "Invalid JSON" };
    }

    const parsed = JSON.parse(jsonString);

    return {
      data: parsed,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Invalid JSON",
    };
  }
}

module.exports = safeJSONParse;
