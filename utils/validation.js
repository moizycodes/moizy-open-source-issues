// <<<<<<< #8-Input-validation-utiliy
const EMAIL_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/


/**
 * 
 * @param {any} value 
 * @returns {object}
 */
const validateRequired = (value) => {
  if (value === null || value === undefined || value === '') {
    return {
      valid: false,
      message: 'this field is required'
    };
  }
  if (typeof value === 'string' && value.trim() === '') {
    return {
      valid: false,
      message: 'this field is required'
    };
  }

  return {
    valid: true,
    message: ''// Corrected "Strict" Regex

  };
};

/**
 * 
 * @param {string} email 
 * @returns {object}
 */

const validateEmail = (email) => {
  if (!EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      message: 'Please Enter a valid email address'
    }
  }

  return {
    valid: true,
    message: ''
  };
};


/**
 * 
 * @param {string} password 
 * @returns 
 */


const validatePassword = (password) => {
  if (!PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: 'Plase Enter a valid Password'
    };
  }
  return {
    valid: true,
    message: ''
  };
};

/**
 * 
 * @param {number} value 
 * @returns 
 */

const validateNumber = (value) => {
  if (isNaN(Number(value))) {
    return { valid: false, message: 'Please enter a valid number.' };
  }

  return {
    valid: true,
    message: ''
  };
};

const ruleRegistry = {

  email: validateEmail,
  password: validatePassword,
  required: validateRequired,
  number: validateNumber ,

}

/**
 * @param {any} value
 * @param {Array<string | object>} rules
 * @returns {object}
 */

const validateField = (value, rules = []) => {
  for (const rule of rules) {
    let ruleName = rule;
    
    if (typeof rule === 'object' && rule.rule) {
      ruleName = rule.rule;
    }

    const validator = ruleRegistry[ruleName];

    if (validator) {
      const result = validator(value);
      if (!result.valid) {
        return result;
      }
    } else {
      console.warn(`Validation rule "${ruleName}" not found.`);
    }
  }

  return { valid: true, message: '' };
};

// Validation utility functions

const validateRequired = (value) => {
  if (!value || value.trim() === "") {
    return { valid: false, message: "This field is required" };
  }
  return { valid: true, message: "" };
};

const validateEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { valid: false, message: "Invalid email format" };
  }
  return { valid: true, message: "" };
};

const validatePassword = (value) => {
  if (value.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/[A-Z]/.test(value)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(value)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }
  if (!/\d/.test(value)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }
  if (!/[!@#$%^&*]/.test(value)) {
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  }
  return { valid: true, message: "" };
};

const validateNumber = (value) => {
  if (isNaN(value) || value === "") {
    return { valid: false, message: "Must be a valid number" };
  }
  return { valid: true, message: "" };
};

const validateField = (value, rules) => {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.valid) {
      return result;
    }
  }
  return { valid: true, message: "" };
};
// >>>>>>> main

module.exports = {validateRequired, validateEmail, validatePassword, validateNumber, validateField, 
                  validateRequired, validateEmail, validatePassword, validateNumber, validateField};