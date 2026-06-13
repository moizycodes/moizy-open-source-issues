"use strict";

/**
 * Environment Variables Validator
 *
 * Validates required environment variables at application startup.
 * Exits the process with code 1 and prints descriptive errors if any
 * variable is missing, empty, or fails type coercion.
 *
 * @example
 * const validateEnv = require('./utils/validateEnv');
 *
 * validateEnv({
 *   DATABASE_URL: "string",
 *   PORT: "number",
 *   JWT_SECRET: "string",
 *   REDIS_URL: { type: "string", required: false }
 * });
 */

const SUPPORTED_TYPES = ["string", "number", "boolean"];

/**
 * Attempts to coerce a raw string env value to the expected type.
 *
 * All environment variables arrive as strings. Numbers are parsed with
 * Number(); booleans accept "true"/"false"/"1"/"0" (case-insensitive).
 *
 * @param {string} raw - The raw string value from process.env
 * @param {"string"|"number"|"boolean"} type
 * @returns {{ valid: boolean }}
 */
function coerceAndValidate(raw, type) {
  if (type === "string") {
    return { valid: true };
  }

  if (type === "number") {
    const parsed = Number(raw);
    return { valid: !isNaN(parsed) };
  }

  if (type === "boolean") {
    const lower = raw.toLowerCase();
    const isValid =
      lower === "true" || lower === "false" || lower === "1" || lower === "0";
    return { valid: isValid };
  }

  return { valid: false };
}

/**
 * Validates environment variables against a schema and exits if any fail.
 *
 * Schema values may be:
 *   - A shorthand type string:  "string" | "number" | "boolean"
 *     (variable is required by default)
 *   - A descriptor object:      { type: "string"|"number"|"boolean", required?: boolean }
 *     (required defaults to true when omitted)
 *
 * Validation rules applied per variable:
 *   1. The type must be one of the supported types.
 *   2. Required variables must be present and non-empty.
 *   3. Present values must be coercible to the declared type.
 *
 * @param {Object.<string, string|{ type: string, required?: boolean }>} schema
 */
function validateEnv(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return;
  }

  const errors = [];

  for (const [key, definition] of Object.entries(schema)) {
    let type;
    let required = true;

    if (typeof definition === "string") {
      type = definition;
    } else if (definition && typeof definition === "object") {
      type = definition.type;
      required = definition.required !== false;
    } else {
      continue;
    }

    if (!SUPPORTED_TYPES.includes(type)) {
      errors.push(
        `❌ Unknown type "${type}" for ${key}. Supported types: ${SUPPORTED_TYPES.join(", ")}.`
      );
      continue;
    }

    const raw = process.env[key];

    if (raw === undefined || raw === null || raw.trim() === "") {
      if (required) {
        errors.push(`❌ Missing required environment variable: ${key}`);
      }
      continue;
    }

    const { valid } = coerceAndValidate(raw, type);

    if (!valid) {
      errors.push(`❌ Invalid type for ${key}. Expected ${type}.`);
    }
  }

  if (errors.length > 0) {
    errors.forEach((err) => console.error(err));
    process.exit(1);
  }
}

module.exports = validateEnv;
