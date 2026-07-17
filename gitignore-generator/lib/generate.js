const { resolveTechnology } = require('./technologies');

function dedupeCaseInsensitive(names) {
  const seen = new Set();
  const result = [];

  for (const name of names) {
    const key = String(name).trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(name);
    }
  }

  return result;
}

function generateGitignore(technologyNames) {
  const uniqueNames = dedupeCaseInsensitive(technologyNames);

  const included = [];
  const unsupported = [];
  const sections = [];
  const seenLines = new Set();

  for (const name of uniqueNames) {
    const tech = resolveTechnology(name);

    if (!tech) {
      unsupported.push(name);
      continue;
    }

    included.push(tech.name);

    const newLines = tech.content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !seenLines.has(line));

    for (const line of newLines) {
      seenLines.add(line);
    }

    if (newLines.length > 0) {
      sections.push(`# ${tech.name}\n${newLines.join('\n')}`);
    }
  }

  const content = sections.length > 0 ? `${sections.join('\n\n')}\n` : '';

  return { content, included, unsupported };
}

module.exports = { generateGitignore };
