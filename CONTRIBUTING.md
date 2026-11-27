# Contributing to moizy-open-source-issues 🚀

Thank you for your interest in contributing! This guide will help you understand how to participate, submit issues, and create pull requests in a professional and organized way.

---

## Table of Contents
1. [How to Contribute](#how-to-contribute)
2. [Branching Guidelines](#branching-guidelines)
3. [Issue Guidelines](#issue-guidelines)
4. [Pull Request Guidelines](#pull-request-guidelines)
5. [Code Style](#code-style)
6. [Testing](#testing)
7. [Community Guidelines](#community-guidelines)
8. [Getting Help](#getting-help)

---

## How to Contribute

1. **Find an Issue**  
   Go to the [Issues](https://github.com/AbdulMoeez1278/moizy-open-source-issues/issues) tab and pick an open issue that interests you.

2. **Claim the Issue**  

   Comment on the issue:  
    ```bash
   I would like to work on this issue.

- Wait for confirmation before starting.

3. **Fork the Repository**  
Click **Fork** in the top-right corner of the repo.

4. **Create a Branch**  
Always work on a separate branch for each issue:  
    ```bash
    git checkout -b issue-<issue-number>-short-description

5. Make Changes and Commit

- Write clean, readable, and well-commented code.
- Commit with a clear message:
  ```bash
  git commit -m "fix: add email validation function"

6. Push and Create PR
    ```bash
    git push origin issue-<issue-number>-short-description

Open a Pull Request referencing the issue.

---

## Branching Guidelines

- main → Always stable, production-ready code.
- issue-<number>-short-description → Each issue gets a separate branch.
- Avoid committing directly to main.

---

## Issue Guidelines

- Only pick one issue at a time.
- Solve the issue within 7 days of assignment.
- Add proper examples or tests if needed.
- Respect existing code style and project structure.

---

## Pull Request Guidelines

- Reference the issue number in PR description:
  ```bash
  Closes #<issue-number>
  
- Provide a clear description of what the PR does.
- Ensure `npm test` passes. GitHub Actions runs it on every PR.
- Avoid unrelated changes in the PR.
- Wait for review and respond politely to feedback.

---

## Code Style

- Follow consistent indentation and formatting.
- Use descriptive variable and function names.
- Comment complex logic for clarity.
- Avoid unnecessary code duplication.

---

## Testing

Tests need Node.js 22 or newer and no dependencies. Run all of them from the repository root:

```bash
npm test
```

Run a single file with `node --test tests/chunk.test.js`.

When you add or change a utility:

- Put its tests in `tests/<utilityName>.test.js` (or `<project>/tests/<name>.test.js` for a mini-project). Only files ending in `.test.js` are picked up.
- Write them with Node's built-in [`node:test`](https://nodejs.org/api/test.html) and `node:assert/strict`. Do not use Jest or other test libraries.
- Assert on results. A test that only prints with `console.log` can never fail.

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const chunk = require('../utils/chunk');

test('chunk splits an array into groups of the given size', () => {
  assert.deepEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
});
```

---

## Community Guidelines

- Be respectful, polite, and professional.
- No spam, trolling, or offensive language.
- Encourage learning and collaboration.
- Respect others’ contributions and opinions.

---

## Getting Help

- If you have questions or need guidance:
- Open a discussion in the Discussions tab.
- Reach out via GitHub issues with [Help Wanted] label.
- Thank you for contributing! Your efforts help make this project better and support the learning community. 🚀

---
