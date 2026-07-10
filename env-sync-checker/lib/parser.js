const fs = require("fs");

function parseEnv(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const variables = {};
    const duplicates = [];
    const emptyKeys = [];

    const lines = data.split("\n");
    lines.forEach((line, index) => {
      line = line.trim();
      if (line === "") {
        return;
      }
      if (line.startsWith("#")) {
        return;
      }
     
      const idx = line.indexOf("=");

      if (idx != -1) {
        const key = line.substring(0, idx);
        const value = line.substring(idx + 1);

        if (key.trim() === "") {
          emptyKeys.push(index + 1);
          return;
        }
        if (key in variables) {
          duplicates.push(key);
          return;
        }
        variables[key.trim()] = value;
      }
    });
    return {
      variables,
      duplicates,
      emptyKeys,
    };
  } catch (error) {
    console.log(`Error: ${filePath} file not found`);
    process.exit(1);
  }
}

module.exports = parseEnv;
