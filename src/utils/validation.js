// --- 1. CORE VALIDATION RESULT CONSTANTS ---

const VALID_RESULT = { valid: true, message: "" };

/**
 * Creates a structured validation result object for a failed rule.
 * @param {string} message - The error message to return.
 * @returns {{ valid: boolean, message: string }}
 */
const createError = (message) => ({
    valid: false,
    message: message
});

// --- 2. INDIVIDUAL RULE FUNCTIONS ---

/**
 * Checks if a value is present (not null, undefined, or an empty string after trimming).
 * Corresponds to validateRequired(value).
 * @param {*} value - The input value.
 * @returns {{ valid: boolean, message: string }}
 */
const validateRequired = (value) => {
    // Coerce to string if possible, then check for emptiness after trimming
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === "")) {
        return createError("This field is required.");
    }
    return VALID_RESULT;
};

/**
 * Checks if a string is a valid email format. Corresponds to validateEmail(value).
 * @param {string} value - The input value.
 * @returns {{ valid: boolean, message: string }}
 */
const validateEmail = (value) => {
    // Simple regex pattern for email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

    // Skip validation if the field is empty (allow other rules to handle required check)
    if (!value) return VALID_RESULT;

    if (!emailRegex.test(String(value))) {
        return createError("Invalid email format.");
    }
    return VALID_RESULT;
};

/**
 * Checks if a string meets minimum password complexity (e.g., minimum length).
 * Corresponds to validatePassword(value).
 * @param {string} value - The input value.
 * @param {number} [minLength=8] - The minimum required length.
 * @returns {{ valid: boolean, message: string }}
 */
const validatePassword = (value, minLength = 8) => {
    if (!value) return VALID_RESULT;
    
    if (String(value).length < minLength) {
        return createError(`Password must be at least ${minLength} characters long.`);
    }
    // Custom rules (like requiring a number/symbol) could be added here
    return VALID_RESULT;
};

/**
 * Checks if a value is a valid non-negative integer or float. Corresponds to validateNumber(value).
 * @param {*} value - The input value.
 * @returns {{ valid: boolean, message: string }}
 */
const validateNumber = (value) => {
    // Skip if empty
    if (value === "" || value === null || value === undefined) return VALID_RESULT;

    const num = Number(value);
    
    if (isNaN(num) || !isFinite(num)) {
        return createError("Must be a valid number.");
    }
    if (num < 0) {
        return createError("Must be a non-negative number.");
    }
    return VALID_RESULT;
};


// --- 3. GENERIC FIELD VALIDATOR (Core Logic) ---

/**
 * The main utility function to validate an input against an array of rules.
 * Stops and returns the result of the first failed rule.
 * Corresponds to validateField(value, rulesArray).
 * @param {*} value - The input value from the form field.
 * @param {Array<Function>} rules - An array of validation functions (or partially applied functions) to run.
 * @returns {{ valid: boolean, message: string }}
 */
function validateField(value, rules) {
    if (!Array.isArray(rules)) {
        console.error("validateField requires an array of rules.");
        return VALID_RESULT;
    }

    for (const rule of rules) {
        if (typeof rule !== 'function') continue; 
        
        // Execute the rule function
        const result = rule(value); 

        // If the result is NOT valid, stop immediately and return the error
        if (result && !result.valid) {
            return result;
        }
    }

    // If all rules passed, return the success result
    return VALID_RESULT;
}

module.exports = {validateRequired, validateEmail, validatePassword, validateNumber, validateField};