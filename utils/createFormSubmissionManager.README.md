# Form Submission State Manager

`createFormSubmissionManager()` is a framework-independent utility for tracking one asynchronous form submission at a time. It has no external dependencies.

## Usage

```js
const createFormSubmissionManager = require('./utils/createFormSubmissionManager');

const form = createFormSubmissionManager();

try {
  const result = await form.submit(() => saveUserData());
  console.log(result);
  console.log(form.getState());
} catch (error) {
  console.error(error);
  console.log(form.getState());
}
```

## API

- `submit(callback)` runs a function and returns a promise for its result. The callback may return a value or a promise. A non-function callback throws a `TypeError`.
- `getState()` returns a fresh snapshot with `{ status, data, error }`.
- `reset()` restores `{ status: 'idle', data: null, error: null }` and returns that snapshot.

The status is one of `idle`, `submitting`, `success`, or `error`. `data` contains the successful callback result, while `error` contains the original rejection value (including non-`Error` values). The unused field is `null`.

## Duplicate submissions and reset

While a callback is pending, subsequent `submit()` calls return the exact same promise. Their callbacks are not invoked. Once it settles, a later call can start a new submission.

Calling `reset()` during a pending submission immediately returns the manager to `idle` and permits a new submission. It does not cancel the original callback or alter the promise already returned to its caller. The older callback's eventual result or error is still delivered to that caller, but cannot overwrite the state of the reset manager or a newer submission.

The utility does not validate form fields, make network requests, or mutate callback arguments or results.

## Tests

Run the focused test file with Node.js:

```bash
node tests/createFormSubmissionManager.test.js
```
