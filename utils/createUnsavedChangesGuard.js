// createUnsavedChangesGuard.js
// A reusable utility for detecting and warning about unsaved changes in web applications.
// Supports multiple independent guard instances and idempotent cleanup.

/**
 * Creates a guard that warns users before leaving a page with unsaved changes.
 * @param {HTMLElement|string} formOrElement - The form element or selector to track
 * @param {Object} options - Configuration options
 * @param {Function} options.onWarn - Callback called when user tries to leave with unsaved changes
 * @param {String} options.message - Custom warning message for the beforeunload event
 * @param {Number} options.ttl - Time-to-live in milliseconds for tracking changes (default: 300000 = 5 minutes)
 * @returns {Object} - Disposal function to remove all event listeners
 */
function createUnsavedChangesGuard(formOrElement, options = {}) {
  const {
    onWarn = (message) => window.onbeforeunload = (e) => e.returnValue = message,
    message = 'You have unsaved changes. Are you sure you want to leave?',
    ttl = 300000,
  } = options;

  let element;
  if (typeof formOrElement === 'string') {
    element = document.querySelector(formOrElement);
  } else {
    element = formOrElement;
  }

  if (!element) {
    console.error('Unsaved changes guard: element not found');
    return { dispose: () => {} };
  }

  let hasUnsavedChanges = false;
  let changeListeners = [];
  let timeoutId = null;

  // Track changes on form elements
  function trackChanges() {
    const inputs = element.querySelectorAll('input, select, textarea');
    changeListeners = Array.from(inputs).map(input => {
      const handler = (e) => {
        hasUnsavedChanges = true;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          hasUnsavedChanges = false;
        }, ttl);
      };
      input.addEventListener('input', handler);
      return { element: input, handler };
    });
  }

  // Track changes on form submission
  function trackSubmit() {
    const form = element.closest('form');
    if (form) {
      const handler = (e) => {
        // Form is being submitted, so unsaved changes are okay
        hasUnsavedChanges = false;
      };
      form.addEventListener('submit', handler);
      changeListeners.push({ element: form, handler });
    }
  }

  // Set up the beforeunload warning
  function setupWarning() {
    onWarn(message);
  }

  // Remove the beforeunload warning
  function removeWarning() {
    try {
      window.onbeforeunload = null;
    } catch { }
  }

  // Idempotent cleanup
  function dispose() {
    // Remove all change listeners
    changeListeners.forEach(({ element, handler }) => {
      try {
        element.removeEventListener(
          handler.eventType || 'input',
          handler.handler
        );
      } catch { }
    });
    changeListeners = [];

    // Remove beforeunload handler
    removeWarning();

    // Clear timeout
    clearTimeout(timeoutId);
    timeoutId = null;

    // Reset state
    hasUnsavedChanges = false;
  }

  // Initialize the guard
  trackChanges();
  trackSubmit();
  setupWarning();

  return { dispose };
}

module.exports = createUnsavedChangesGuard;