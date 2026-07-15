# moizy-open-source-issues

Welcome to **Moizy Open Source Issues**, a developer-friendly hub where you can learn, contribute, and improve your coding skills. This repository hosts beginner-friendly and intermediate issues that anyone can pick up, solve, and submit via Pull Requests.

---

## 🌟 Why Contribute?

- Gain real-world experience by solving issues.
- Build a strong GitHub profile with meaningful contributions.
- Collaborate with other developers and grow your network.
- Improve coding, problem-solving, and version control skills.

---

## 📂 Repository Structure
    ```bash
    /issues
    └── beginner
    └── intermediate
    /README.md
    /CONTRIBUTING.md
    /LICENSE

- **Beginner:** Issues for newcomers, simple and easy to solve.  
- **Intermediate:** Slightly complex issues to challenge your skills.

---

## 🛠 How to Contribute

1. Go to the **Issues** tab.
2. Pick an open issue that you want to work on.
3. Comment: `"I want to work on this"` to claim it.
4. Fork the repository and create a branch for your work:
   ```bash
   git checkout -b issue-<issue-number>-your-name
5. Solve the issue, write clean code, and commit changes:
   ```bash
   git commit -m "fix: <short-description-of-fix>"
   
6. Push the branch and create a Pull Request (PR) referencing the issue.

7. Wait for review and merge.

---

## Available Utilities

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

### .gitignore Generator

Use `gitignore-generator/gitignore.js` to generate a ready-to-use `.gitignore` file for one or more technologies (Node.js, React, Next.js, Express.js, VS Code, JetBrains IDEs, Python, Docker, Laravel, Flutter, Android, Go, Rust, Java).

```bash
node gitignore-generator/gitignore.js node react vscode
```

See `gitignore-generator/README.md` for full usage and supported technologies.

---

✅ Issue Guidelines

- Only pick one issue at a time.
- Solve the issue within 7 days.
- Keep code readable and well-commented.
- Include tests or examples if applicable.
- Respect others’ contributions.

---

🎯 Labels

- `good first issue` — Beginner-friendly issues.
- `help wanted` — Issues that need extra eyes.
- `intermediate` — Slightly challenging issues.

---

📜 License

This repository is licensed under the MIT License. See the LICENSE file for details. You’re free to use, modify, and contribute while giving credit.

---

🤝 Join the Community

We encourage discussions, questions, and collaboration! Feel free to open a discussion in the Discussions tab for guidance, doubts, or project ideas.

---

💡 Keep Learning

Every issue is a chance to practice, learn, and showcase your skills. Start contributing today and grow your developer profile. 🚀
