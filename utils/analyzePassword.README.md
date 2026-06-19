# analyzePassword

Analyzes the strength of a password and returns a numeric score, a strength
classification, and actionable feedback for improving it. No external
password-strength libraries are used.

## Usage

```js
const analyzePassword = require('./utils/analyzePassword');

analyzePassword('Password123');
// {
//   score: 55,
//   strength: 'Fair',
//   feedback: ['Add special characters', 'Avoid predictable sequences']
// }
```

## API

### `analyzePassword(password)`

| Parameter  | Type     | Description                  |
| ---------- | -------- | ---------------------------- |
| `password` | `string` | The password to analyze.     |

Returns an object:

| Field      | Type       | Description                                       |
| ---------- | ---------- | ------------------------------------------------- |
| `score`    | `number`   | Strength score from `0` to `100`.                 |
| `strength` | `string`   | One of `Weak`, `Fair`, `Good`, `Strong`.          |
| `feedback` | `string[]` | Suggestions for improving the password.           |

## Scoring

The score is built additively, then reduced by penalties and clamped to
`0`–`100`:

- **Length** — longer passwords score higher (`>= 8`, `>= 12`, `>= 16` tiers).
  Passwords shorter than 8 characters are flagged.
- **Character variety** — points are awarded for each of lowercase, uppercase,
  numbers, and special characters present. Missing classes are flagged.
- **Repeated characters** — runs of three or more identical characters
  (e.g. `aaaa`) reduce the score.
- **Predictable sequences** — alphabetical, numeric, or keyboard sequences
  (e.g. `abc`, `123`, `qwe`), forward or reverse, reduce the score.
- **Common passwords** — passwords such as `password`, `123456`, or `qwerty`
  are always scored `0` and classified as `Weak`.

## Strength bands

| Score    | Strength |
| -------- | -------- |
| 0 – 30   | Weak     |
| 31 – 60  | Fair     |
| 61 – 80  | Good     |
| 81 – 100 | Strong   |

## Edge cases

- Empty string, `null`, `undefined`, and non-string inputs return
  `{ score: 0, strength: 'Weak', feedback: ['Provide a password'] }`.
- Common-password detection is case-insensitive.

## Tests

```bash
node --test tests/analyzePassword.test.js
```

## Example

```bash
node examples/analyzePasswordExample.js
```
