'use strict';

/**
 * Creates a framework-independent manager for an asynchronous form submission.
 *
 * Duplicate calls made while a submission is pending receive the same promise.
 * Resetting during a submission invalidates that submission's state updates,
 * but does not cancel the callback or change the promise returned to its caller.
 *
 * @returns {{submit: (callback: Function) => Promise<*>, getState: () => object, reset: () => object}}
 *
 * @example
 * const form = createFormSubmissionManager();
 * await form.submit(() => saveUser());
 * console.log(form.getState()); // { status: 'success', data: ..., error: null }
 */
function createFormSubmissionManager() {
  let state = createIdleState();
  let pendingPromise = null;
  let submissionId = 0;

  function getState() {
    return { ...state };
  }

  function reset() {
    submissionId += 1;
    pendingPromise = null;
    state = createIdleState();
    return getState();
  }

  function submit(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('submit expects a callback function');
    }

    if (pendingPromise) {
      return pendingPromise;
    }

    const currentSubmissionId = ++submissionId;
    state = { status: 'submitting', data: null, error: null };

    const currentPromise = Promise.resolve()
      .then(() => callback())
      .then(
        (data) => {
          if (submissionId === currentSubmissionId) {
            state = { status: 'success', data, error: null };
          }
          return data;
        },
        (error) => {
          if (submissionId === currentSubmissionId) {
            state = { status: 'error', data: null, error };
          }
          throw error;
        }
      )
      .finally(() => {
        if (submissionId === currentSubmissionId) {
          pendingPromise = null;
        }
      });

    pendingPromise = currentPromise;
    return currentPromise;
  }

  return { submit, getState, reset };
}

function createIdleState() {
  return { status: 'idle', data: null, error: null };
}

module.exports = createFormSubmissionManager;
