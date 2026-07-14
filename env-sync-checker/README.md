## Environment Sync Checker

### Overview

The Environment Sync Checker is a CLI tool that compares `.env` and `.env.example` files and detects missing, extra, duplicate, and empty environment variables.

It helps developers keep environment configuration files synchronized and prevents runtime errors caused by missing variables.

### Project Structure
```text
/env-sync-checker
├── env-check.js
├── lib/
│   ├── parser.js
│   ├── comparator.js
│   └── reporter.js
├── tests/
│   ├── envComparator.test.js
│   └── envParser.test.js
└── README.md    

```

### Usage

Run with default files:

```bash
node env-check.js
```

### Use custom file paths:

```bash
node env-check.js --env .env.production --example .env.example
```
### Features
- Parses `.env` and `.env.example` files
- Detects missing variables in `.env.example`
- Detects extra variables in `.env.example`
- Detects duplicate keys
- Detects empty variable names
- Provides a summary report
- Returns a non-zero exit code when mismatches are found

### Example

.env
```env
DATABASE_URL=mysql
JWT_SECRET=secret
REDIS_URL=redis
```

.env.example
```env
DATABASE_URL=
JWT_SECRET=
```

Output:
```text
✔ DATABASE_URL
✔ JWT_SECRET

❌ Missing in .env.example:
- REDIS_URL

Summary:
2 Matched
1 Missing
```

### Error Handling

The tool provides helpful errors for:
- Missing `.env` files
- Missing `.env.example` files
- Empty environment configurations
- Invalid environment variable definitions

### Exit Codes

- `0` - No mismatches found
- `1` - Missing, extra, duplicate, or invalid variables detected

### Running Tests

Run parser tests:

```bash
node tests/envParser.test.js
```
Run comparator tests:

```bash
node tests/envComparator.test.js
```
### Installation

No external dependencies are required. Run the tool using Node.js.