# Code Style Guidelines for moizy-open-source-issues 🚀

Welcome to the coding standards for **moizy-open-source-issues**.  
Following these guidelines ensures consistency, readability, and maintainability across all contributions. All contributors are expected to follow these rules.

---

## 1. General Guidelines

- Write **clean, readable, and self-explanatory code**.
- Use **English** for variable names, function names, and comments.
- Avoid long functions; break code into **modular reusable components**.
- Remove **console.log/debug statements** before committing.
- Keep files and folders **organized and meaningful**.

---

## 2. JavaScript (ES6+)

### Naming Conventions
- **Variables:** camelCase → `userName`, `emailAddress`
- **Constants:** UPPERCASE → `MAX_ATTEMPTS`
- **Functions:** camelCase → `validateEmail()`
- **Classes:** PascalCase → `UserProfile`

### Formatting
- 2 spaces for indentation
- Use **single quotes** for strings `'example'`
- Add **semicolon** at the end of statements
- Always use **strict equality** `===` instead of `==`
- Arrow functions preferred when appropriate
  ```js
  // Good
  const sum = (a, b) => a + b;

  // Bad
  function sum(a,b){
  return a+b
  }
  ```

### Code Structure

- Keep functions short and focused
- Group related functions together
- Separate concerns (UI, logic, API calls)
- Add comments for complex logic

---

## 3. HTML

- Use semantic HTML tags (`<header>`, `<main>`, `<footer>`, `<section>`)
- Indent nested elements with 2 spaces
- Lowercase tag names and attributes
- Close all tags properly
- Use meaningful IDs and classes

  ```html
  <!-- Good -->
  <section class="user-profile">
    <h2>User Profile</h2>
  </section>

  <!-- Bad -->
  <div id="div1"><h2>Profile</h2></div>
  ```

---

## 4. CSS / SCSS / Tailwind

- Use kebab-case for class names → btn-primary, form-input
- Indent rules with 2 spaces
- Keep selectors short and meaningful
- Avoid deep nesting (>3 levels)
- Use variables for colors, spacing, fonts (if using SCSS)
- Prefer Tailwind classes for rapid prototyping, but keep readability

  ```css
  /* Good */
  .btn-primary {
    background-color: #1d4ed8;
    color: #ffffff;
    padding: 0.5rem 1rem;
  }

  /* Bad */
  .buttonBlue {color:white;background:blue;padding:5px 10px;}
  ```

---

## 5. Commit Messages

- Use imperative mood → "Add feature", "Fix bug", "Update README"
- Prefix commits with type:
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation changes
  - `style:` formatting, missing semi-colons, white-space
  - `refactor:` code change without adding feature/fixing bug

  ```bash
  git commit -m "feat: add email validation function"
  ```

---

## 6. Pull Requests

- Each PR should focus on one issue.
- Include a clear description of changes.
- Reference the issue number it resolves:

  ```text
  Closes #<issue-number>
  ```

- Ensure `npm test` passes.
- Maintain readability and consistency.

---

## 7. Testing

- Include test cases for functions in `tests/<name>.test.js`, written with `node:test` and `node:assert`.
- Run all tests with `npm test`.
- Keep tests small and focused.
- Name tests clearly → `validateEmail returns true for valid email`.

---

## 8. Best Practices

- Follow DRY principle – Don't Repeat Yourself
- Avoid global variables unless necessary
- Modularize code for reusability
- Always review before committing
- Respect project structure and naming conventions

---

By following this Code Style Guide, all contributions to Moizy Open Source Issues will remain consistent, professional, and easy to maintain.

Happy Coding! 🚀
