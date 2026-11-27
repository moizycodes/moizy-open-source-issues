// utils/errorHandler.js

// Custom Error Classes
class NetworkError extends Error {
    constructor(message = 'Network error occurred') {
        super(message);
        this.name = 'NetworkError';
    }
}

class ServerError extends Error {
    constructor(status, message = 'Server error occurred') {
        super(message);
        this.name = 'ServerError';
        this.status = status;
    }
}

class ValidationError extends Error {
    constructor(errors = [], message = 'Validation error occurred') {
        super(message);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

// Centralized Error Handler
const handleError = (error) => {
    let userMessage = 'An unexpected error occurred. Please try again.';

    if (error instanceof NetworkError) {
        console.error(`[NetworkError]: ${error.message}`);
        userMessage = 'Unable to connect. Please check your internet connection.';
    } else if (error instanceof ServerError) {
        console.error(`[ServerError - ${error.status}]: ${error.message}`);
        userMessage = 'Server is not responding. Please try again later.';
    } else if (error instanceof ValidationError) {
        console.error(`[ValidationError]: ${error.errors.join(', ')}`);
        userMessage = 'There are validation errors. Please check your input.';
    } else {
        console.error(`[UnknownError]: ${error.message || error}`);
    }

    if (typeof showUserNotification === 'function') {
        showUserNotification(userMessage);
    }

    return userMessage;
};

module.exports = { NetworkError, ServerError, ValidationError, handleError };