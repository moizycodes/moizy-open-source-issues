#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { generateGitignore } = require('./lib/generate');
const { listSupported } = require('./lib/technologies');

function printUsage() {
  console.error('Usage: node gitignore.js <technology> [technology...]');
  console.error(`Supported technologies: ${listSupported().join(', ')}`);
  console.error('Example: node gitignore.js node react vscode');
}

function main(argv) {
  if (argv.length === 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const { content, included, unsupported } = generateGitignore(argv);

  for (const name of unsupported) {
    console.error(`Unsupported technology: ${name}`);
  }

  if (included.length === 0) {
    process.exitCode = 1;
    return;
  }

  const outputPath = path.join(process.cwd(), '.gitignore');
  fs.writeFileSync(outputPath, content);

  console.log(`.gitignore created for: ${included.join(', ')}`);
}

main(process.argv.slice(2));
