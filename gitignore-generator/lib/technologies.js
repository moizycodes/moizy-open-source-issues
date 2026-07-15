const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const DISPLAY_NAMES = {
  node: 'Node.js',
  react: 'React',
  nextjs: 'Next.js',
  express: 'Express.js',
  vscode: 'VS Code',
  jetbrains: 'JetBrains IDEs',
  python: 'Python',
  docker: 'Docker',
  laravel: 'Laravel',
  flutter: 'Flutter',
  android: 'Android',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
};

const ALIASES = {
  nodejs: 'node',
  next: 'nextjs',
  expressjs: 'express',
  'vs-code': 'vscode',
  intellij: 'jetbrains',
  py: 'python',
  golang: 'go',
};

function normalize(name) {
  return String(name).trim().toLowerCase();
}

function toSlug(name) {
  const normalized = normalize(name);
  return ALIASES[normalized] || normalized;
}

function listSupported() {
  return Object.keys(DISPLAY_NAMES);
}

function resolveTechnology(name) {
  const slug = toSlug(name);

  if (!DISPLAY_NAMES[slug]) {
    return null;
  }

  const content = fs.readFileSync(path.join(TEMPLATES_DIR, `${slug}.txt`), 'utf8');

  return {
    slug,
    name: DISPLAY_NAMES[slug],
    content,
  };
}

module.exports = {
  resolveTechnology,
  listSupported,
};
