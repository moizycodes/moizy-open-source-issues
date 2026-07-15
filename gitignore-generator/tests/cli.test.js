const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const CLI_PATH = path.join(__dirname, '..', 'gitignore.js');

function runCli(args, cwd) {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8',
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gitignore-cli-test-'));
}

test('creates a .gitignore file for valid technologies', () => {
  const cwd = makeTempDir();
  const result = runCli(['node', 'react'], cwd);

  assert.equal(result.status, 0);
  const written = fs.readFileSync(path.join(cwd, '.gitignore'), 'utf8');
  assert.match(written, /# Node\.js/);
  assert.match(written, /# React/);
});

test('prints usage and exits non-zero with no arguments', () => {
  const cwd = makeTempDir();
  const result = runCli([], cwd);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
  assert.equal(fs.existsSync(path.join(cwd, '.gitignore')), false);
});

test('overwrites an existing .gitignore', () => {
  const cwd = makeTempDir();
  fs.writeFileSync(path.join(cwd, '.gitignore'), 'old-content-that-should-be-replaced\n');

  const result = runCli(['python'], cwd);

  assert.equal(result.status, 0);
  const written = fs.readFileSync(path.join(cwd, '.gitignore'), 'utf8');
  assert.doesNotMatch(written, /old-content-that-should-be-replaced/);
  assert.match(written, /# Python/);
});

test('exits non-zero and writes nothing when all technologies are unsupported', () => {
  const cwd = makeTempDir();
  const result = runCli(['unknown'], cwd);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unsupported technology: unknown/);
  assert.equal(fs.existsSync(path.join(cwd, '.gitignore')), false);
});

test('exits zero and writes valid rules when input is a mix of valid and invalid', () => {
  const cwd = makeTempDir();
  const result = runCli(['node', 'unknown'], cwd);

  assert.equal(result.status, 0);
  assert.match(result.stderr, /Unsupported technology: unknown/);
  const written = fs.readFileSync(path.join(cwd, '.gitignore'), 'utf8');
  assert.match(written, /# Node\.js/);
});
