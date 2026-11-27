# moizy-open-source-issues

[![Tests](https://github.com/moizycodes/moizy-open-source-issues/actions/workflows/test.yml/badge.svg)](https://github.com/moizycodes/moizy-open-source-issues/actions/workflows/test.yml)

Welcome to **Moizy Open Source Issues**, a developer-friendly hub where you can learn, contribute, and improve your coding skills. This repository hosts beginner-friendly and intermediate issues that anyone can pick up, solve, and submit via Pull Requests.

Every merged solution stays in the repository as a small, dependency-free JavaScript utility or mini-project, so the codebase doubles as a collection of worked examples.

---

## 🌟 Why Contribute?

- Gain real-world experience by solving issues.
- Build a strong GitHub profile with meaningful contributions.
- Collaborate with other developers and grow your network.
- Improve coding, problem-solving, and version control skills.

---

## 📂 Repository Structure

```text
utils/                 Standalone utility functions and classes, one per file
tests/                 Tests for the utilities (tests/<name>.test.js)
examples/              Runnable usage examples
cache-system/          Mini-projects, each with its own README
event-emitter/
rate-limiter/
env-sync-checker/
gitignore-generator/
secret-checker/
markdown-previewer/
components/            HTML/CSS components
.github/               Issue and pull request templates, CI workflow
```

The project is plain Node.js (CommonJS) with no dependencies, so there is nothing to install.

---

## 🛠 How to Contribute

1. Go to the **Issues** tab.
2. Pick an open issue that you want to work on.
3. Comment: `"I want to work on this"` to claim it.
4. Fork the repository and create a branch for your work:
   ```bash
   git checkout -b issue-<issue-number>-your-name
   ```
5. Solve the issue, write clean code, and commit changes:
   ```bash
   git commit -m "fix: <short-description-of-fix>"
   ```
6. Run the tests (see below), then push the branch and create a Pull Request (PR) referencing the issue.
7. Wait for review and merge.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_STYLE.md](CODE_STYLE.md) for the full guidelines.

---

## 🧪 Running the Tests

Tests use Node's built-in test runner and need Node.js 22 or newer.

```bash
npm test                                # run everything
node --test tests/chunk.test.js         # run one file
```

GitHub Actions runs `npm test` on every pull request. New utilities should come with a `tests/<name>.test.js` file written with `node:test` and `node:assert`; see the Testing section of [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🧰 Available Utilities

Each utility lives in `utils/<name>.js` and is loaded with `require`:

```js
const chunk = require('./utils/chunk');

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

The file itself documents its parameters and return value.

### Functions and timing

| Utility | What it does |
| --- | --- |
| `debounce` | Delays a function until calls stop for a given time; `cancel()` drops the pending call. |
| `debounceAsync` | Debounces an async function; every caller in the window gets the final result. |
| `throttle` | Limits a function to one call per interval, with leading and trailing options. |
| `rateLimit` | Wraps a function so it throws after a number of calls per interval. |
| `once` | Runs a function only the first time and returns the cached result afterwards. |
| `memoize` | Caches a function's results by its arguments. |
| `pipe` | Chains functions left to right, skipping values that are not functions. |
| `functional` | `pipe` and `compose` that throw a `TypeError` for values that are not functions. |
| `sleep` | Returns a promise that resolves after a number of milliseconds. |

### Async control

| Utility | What it does |
| --- | --- |
| `retry` | Retries an async function with exponential backoff (`retries`, `delay`, `factor`). |
| `retryAsync` | Retries an async function with an optional doubling delay (`retries`, `delay`, `backoff`). |
| `withTimeout` | Rejects if a promise does not settle within a time limit. |
| `pLimit` | Limits how many async tasks run at the same time. |
| `TaskQueue` | Runs queued async tasks one at a time, in order. |
| `preventDuplicateSubmit` | Returns the in-flight promise instead of running an async function twice. |
| `createFormSubmissionManager` | Tracks the state of an async form submission and blocks duplicates. |
| `DuplicateRequestDetector` | Blocks requests whose ID was already seen within a TTL window. |

### Objects and arrays

| Utility | What it does |
| --- | --- |
| `chunk` | Splits an array into groups of a given size. |
| `shuffle` | Shuffles an array in place with the Fisher-Yates algorithm. |
| `groupBy` | Groups array items by a property or callback. |
| `pick` | Copies only the given keys of an object. |
| `omit` | Copies an object without the given keys. |
| `get` | Reads a nested value by path, with a default for missing paths. |
| `flattenObject` | Flattens a nested object into dot-notation keys. |
| `deepClone` | Deep-copies objects and arrays, including circular references. |
| `deepEqual` | Checks whether two values are deeply equal. |
| `deepFreeze` | Recursively freezes an object and everything nested in it. |
| `deepMerge` | Deeply merges two or more objects into a new one. |
| `uniqueId` | Generates incrementing IDs with an optional prefix. |

### Strings, URLs and formatting

| Utility | What it does |
| --- | --- |
| `capitalize` | Uppercases the first character of a string. |
| `formatCurrency` | Formats a number with thousand separators, decimals and an optional currency. |
| `sanitizeFileName` | Makes a file name safe for file systems and URLs while keeping its extension. |
| `safeJSONParse` | Parses JSON and returns `{ data, error }` instead of throwing. |
| `queryString` | `parseQuery` and `stringifyQuery` for simple query strings. |
| `parseQueryParams` | Parses a query string, collecting repeated keys into arrays. |
| `buildQueryString` | Builds an encoded query string, repeating keys for array values. |

### Validation

| Utility | What it does |
| --- | --- |
| `validate` | Validates data against a schema of typed rules. |
| `validation` | Field validators: required, email, password, number, and `validateField`. |
| `validateEmail` | Returns `true` for a well-formed email address. |
| `validateDateRange` | Validates a `YYYY-MM-DD` date range with optional length limits. |
| `validateDateTimeFormat` | Validates strict ISO 8601 date and date-time strings. |
| `validateFile` | Validates the size and type of an uploaded file. |
| `validateEnv` | Checks required environment variables at startup. |
| `validatePaginationResponse` | Checks that a paginated API response has consistent fields. |
| `sanitizeFormData` | Trims and cleans submitted form data, including nested values. |

### Security and diagnostics

| Utility | What it does |
| --- | --- |
| `maskSensitiveData` | Returns a copy of data with passwords, tokens and similar fields masked. |
| `isTokenExpired` | Checks the `exp` claim of a JWT. |
| `checkSecurityHeader` | Scores a set of HTTP response headers against recommended security headers. |
| `normalizeCspReport` | Converts CSP violation reports of different formats into one shape. |
| `checkHtmlAccessibility` | Finds common accessibility problems in an HTML string. |
| `checkBrokenLinks` | Requests a list of URLs and reports which are broken. |
| `detectConfigDrift` | Reports added, removed and changed keys between two config objects. |
| `detectSchemaDrift` | Reports structural differences between two JSON-compatible values. |
| `isCacheStale` | Checks whether a cache entry is older than its TTL. |

### Browser helpers

| Utility | What it does |
| --- | --- |
| `focusTrap` | Keeps keyboard focus inside a modal, drawer or other overlay. |
| `createUnsavedChangesGuard` | Asks for confirmation before leaving a page with unsaved changes. |
| `createEventListenerTracker` | Records event listeners so they can be removed one by one or all at once. |
| `storageManager` | Reads and writes JSON in `localStorage` without throwing. |

### Application structure

| Utility | What it does |
| --- | --- |
| `Container` | A small dependency injection container with singleton and transient services. |
| `errorHandler` | Network, server and validation error classes with one `handleError` function. |
| `apiService` | A `fetch` wrapper that reports failures through `errorHandler`. |

---

## 📦 Mini-Projects

| Folder | What it is |
| --- | --- |
| [`cache-system/`](cache-system/README.md) | In-memory cache with optional TTL expiration. |
| [`event-emitter/`](event-emitter/README.md) | Publish/subscribe event emitter with one-time listeners and middleware. |
| [`rate-limiter/`](rate-limiter/README.md) | Class that allows a number of requests per time window. |
| [`env-sync-checker/`](env-sync-checker/README.md) | CLI that compares `.env` with `.env.example`. |
| [`gitignore-generator/`](gitignore-generator/README.md) | CLI that generates a `.gitignore` for one or more technologies. |
| [`secret-checker/`](secret-checker/README.md) | CLI that scans Git-staged files for secrets before a commit. |
| [`markdown-previewer/`](markdown-previewer/README.md) | Browser page that renders Markdown as you type. |
| `components/navbar/` | Responsive navbar with a CSS-only hamburger menu. |

---

## 📖 Usage Examples

More runnable examples are in [`examples/`](examples).

### Async Debouncing

Use `utils/debounceAsync.js` to delay an asynchronous operation until calls stop arriving for the configured delay.

```js
const debounceAsync = require("./utils/debounceAsync");

const searchUsers = debounceAsync(async query => {
  const response = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Unable to search users");
  }
  return response.json();
}, 300);

searchUsers("rea").then(users => console.log(users));
searchUsers("react").then(users => console.log(users));
```

Only the latest call in a debounce window invokes the callback. Every promise returned during that window settles with the final invocation's value or error. The latest call's arguments and `this` context are used. The callback may return a promise or a regular value. The delay must be a finite, non-negative number.

### Sensitive Data Masking

Use `utils/maskSensitiveData.js` to create a safe copy of data before logging.
It masks common sensitive fields such as `password`, `token`, `accessToken`,
`refreshToken`, `secret`, `apiKey`, and `creditCard`.

```js
const maskSensitiveData = require('./utils/maskSensitiveData');

const user = {
  email: 'john@example.com',
  password: 'secret123'
};

const safeUser = maskSensitiveData(user);

console.log(safeUser);
// { email: 'john@example.com', password: '********' }
```

Custom fields can be added when needed:

```js
maskSensitiveData(user, ['salary', 'nationalId']);
```

### Date Range Validation

Use `utils/validateDateRange.js` to validate strict calendar date ranges without adding dependencies.

```js
const validateDateRange = require("./utils/validateDateRange");

const result = validateDateRange("2026-09-15", "2026-09-20", {
  allowSameDay: true,
  minDays: 1,
  maxDays: 30
});

if (!result.valid) {
  console.error(result.reason);
}
```

Date strings must use the unambiguous `YYYY-MM-DD` format. Valid JavaScript `Date` instances are also accepted and interpreted by their UTC calendar date. Same-day ranges are rejected by default. The optional `allowSameDay`, `minDays`, and `maxDays` settings are validated before the dates are checked. Invalid inputs or options return `{ valid: false, reason }`; valid ranges return normalized date strings and the number of days between them.

### Unsaved Changes Guard

Use `utils/createUnsavedChangesGuard.js` to track unsaved page changes and ask the browser to show its standard leave-page confirmation when a user closes, refreshes, or navigates away from a dirty page.

```js
const { createUnsavedChangesGuard } = require('./utils/createUnsavedChangesGuard');

const guard = createUnsavedChangesGuard();

form.addEventListener('input', () => guard.markDirty());
form.addEventListener('submit', () => guard.markClean());

// Call when the page or component is disposed.
window.addEventListener('pagehide', () => guard.destroy(), { once: true });
```

The guard exposes `markDirty()`, `markClean()`, `isDirty()`, and `destroy()`. It registers one `beforeunload` listener while dirty and removes only that listener when clean or destroyed, leaving unrelated handlers untouched. Browsers control the confirmation dialog text, so the utility relies only on the standard `preventDefault()` and empty `returnValue` signal. An optional event target can be passed to `createUnsavedChangesGuard(target)` for testing or non-window integrations.

### .gitignore Generator

Use `gitignore-generator/gitignore.js` to generate a ready-to-use `.gitignore` file for one or more technologies (Node.js, React, Next.js, Express.js, VS Code, JetBrains IDEs, Python, Docker, Laravel, Flutter, Android, Go, Rust, Java).

```bash
node gitignore-generator/gitignore.js node react vscode
```

See `gitignore-generator/README.md` for full usage and supported technologies.

---

## ✅ Issue Guidelines

- Only pick one issue at a time.
- Solve the issue within 7 days.
- Keep code readable and well-commented.
- Include tests or examples if applicable.
- Respect others’ contributions.

---

## 🎯 Labels

- `good first issue` — Beginner-friendly issues.
- `help wanted` — Issues that need extra eyes.
- `intermediate` — Slightly challenging issues.

---

## 📜 License

This repository is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. You’re free to use, modify, and contribute while giving credit.

---

## 🤝 Join the Community

We encourage discussions, questions, and collaboration! Feel free to open a discussion in the Discussions tab for guidance, doubts, or project ideas.

---

## 💡 Keep Learning

Every issue is a chance to practice, learn, and showcase your skills. Start contributing today and grow your developer profile. 🚀
