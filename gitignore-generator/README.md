# .gitignore Generator

A dependency-free CLI that generates a ready-to-use `.gitignore` file for one or more technologies, so you don't have to search for the right ignore rules every time you start a project.

## Usage

```bash
node gitignore.js <technology> [technology...]
```

### Example

```bash
node gitignore.js node react vscode
```

Creates a `.gitignore` in the current directory, merging the rules for Node.js, React, and VS Code with no duplicate lines.

## Supported technologies

| Slug | Aliases | Display name |
|---|---|---|
| `node` | `nodejs` | Node.js |
| `react` | — | React |
| `nextjs` | `next` | Next.js |
| `express` | `expressjs` | Express.js |
| `vscode` | `vs-code` | VS Code |
| `jetbrains` | `intellij` | JetBrains IDEs |
| `python` | `py` | Python |
| `docker` | — | Docker |
| `laravel` | — | Laravel |
| `flutter` | — | Flutter |
| `android` | — | Android |
| `go` | `golang` | Go |
| `rust` | — | Rust |
| `java` | — | Java |

Technology names are case-insensitive.

## Behavior

- **Merging:** rules from each requested technology are combined; any line already added by an earlier technology is skipped, so the output has no duplicate entries.
- **Duplicate arguments:** `node gitignore.js node node react` is treated the same as `node gitignore.js node react`.
- **Existing `.gitignore`:** if one already exists in the current directory, it is overwritten.
- **Unsupported technology:** printed as a warning (`Unsupported technology: <name>`) and skipped; the file is still generated for any valid technologies in the same command.
- **No arguments:** prints usage instructions and exits with a non-zero status.
- **All technologies unsupported:** prints a warning for each and exits with a non-zero status without writing a file.

## Project layout

```
gitignore-generator/
├── gitignore.js          # CLI entry point
├── lib/
│   ├── technologies.js   # slug/alias resolution + template loading
│   └── generate.js       # merges technologies into deduped .gitignore content
├── templates/            # one .txt file per supported technology
├── tests/                # node:test suite
└── README.md
```

## Testing

Tests use Node's built-in test runner, so no extra dependencies are required:

```bash
node --test gitignore-generator/tests/*.test.js
```
