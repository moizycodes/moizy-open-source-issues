/**
 * detectSchemaDrift
 *
 * Compares two JSON-compatible values and reports structural differences
 * using JSONPath-style locations and typed change classifications.
 *
 * @param {*} expected - The reference value (e.g. a saved API fixture).
 * @param {*} actual - The value to compare against (e.g. a live response).
 * @returns {{ hasDrift: boolean, changes: Array<{path: string, type: string, expected: string|null, actual: string|null}> }}
 *
 * @example
 * detectSchemaDrift(
 *   { id: 42, name: "Abdul", email: "abdul@example.com" },
 *   { id: "42", name: "Abdul", username: "Abdul" }
 * );
 * // {
 * //   hasDrift: true,
 * //   changes: [
 * //     { path: "$.email", type: "field_removed", expected: "string", actual: null },
 * //     { path: "$.id", type: "type_changed", expected: "number", actual: "string" },
 * //     { path: "$.username", type: "field_added", expected: null, actual: "string" }
 * //   ]
 * // }
 */
function detectSchemaDrift(expected, actual) {
  const changes = [];

  function typeOf(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    return typeof value;
  }

  function walk(exp, act, path) {
    const expType = typeOf(exp);
    const actType = typeOf(act);

    if (expType !== actType) {
      changes.push({
        path,
        type: "type_changed",
        expected: expType,
        actual: actType,
      });
      return;
    }

    if (expType === "object") {
      const allKeys = new Set([...Object.keys(exp), ...Object.keys(act)]);
      for (const key of allKeys) {
        const childPath = `${path}.${key}`;
        const inExp = Object.prototype.hasOwnProperty.call(exp, key);
        const inAct = Object.prototype.hasOwnProperty.call(act, key);

        if (!inAct) {
          changes.push({
            path: childPath,
            type: "field_removed",
            expected: typeOf(exp[key]),
            actual: null,
          });
        } else if (!inExp) {
          changes.push({
            path: childPath,
            type: "field_added",
            expected: null,
            actual: typeOf(act[key]),
          });
        } else {
          walk(exp[key], act[key], childPath);
        }
      }
      return;
    }

    if (expType === "array") {
      if (exp.length > 0 && act.length > 0) {
        const expItemType = typeOf(exp[0]);
        const actItemType = typeOf(act[0]);
        if (expItemType !== actItemType) {
          changes.push({
            path,
            type: "array_item_type_changed",
            expected: expItemType,
            actual: actItemType,
          });
        }
      }
      return;
    }
  }

  if (expected === undefined && actual === undefined) {
    return { hasDrift: false, changes: [] };
  }

  walk(expected, actual, "$");

  changes.sort((a, b) => a.path.localeCompare(b.path));

  return {
    hasDrift: changes.length > 0,
    changes,
  };
}

module.exports = { detectSchemaDrift };