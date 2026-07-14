function report(parsedEnv, parsedExample, comparison) {
  const { matchedKeys, missingKeys, extraKeys } = comparison;
  const { duplicates: envDuplicates, emptyKeys: envEmptyKeys } = parsedEnv;

  const { duplicates: exampleDuplicates, emptyKeys: exampleEmptyKeys } =
    parsedExample;

  if (matchedKeys.length > 0) {
    console.log("Matched Variables:");

    for (const key of matchedKeys) {
      console.log(`✔ ${key}`);
    }

    console.log();
  }
  if (missingKeys.length > 0) {
    console.log("❌ Missing in .env.example:");

    for (const key of missingKeys) {
      console.log(`- ${key}`);
    }

    console.log();
  }

  if (extraKeys.length > 0) {
    console.log("⚠ Extra in .env.example:");

    for (const key of extraKeys) {
      console.log(`- ${key}`);
    }

    console.log();
  }
  if (envDuplicates.length > 0) {
    console.log("⚠ Duplicates in .env:");

    for (const dup of envDuplicates) {
      console.log(`- ${dup}`);
    }

    console.log();
  }
  if (exampleDuplicates.length > 0) {
    console.log("⚠ Duplicates in .env.example:");

    for (const dup of exampleDuplicates) {
      console.log(`- ${dup}`);
    }

    console.log();
  }
  if (envEmptyKeys.length > 0) {
    console.log("⚠ Empty Keys in .env:");

    for (const key of envEmptyKeys) {
      console.log(`Line ${key}`);
    }

    console.log();
  }
  if (exampleEmptyKeys.length > 0) {
    console.log("⚠ Empty Keys in .env.example:");

    for (const key of exampleEmptyKeys) {
      console.log(`Line ${key}`);
    }

    console.log();
  }
  console.log("Summary:");
  if (matchedKeys.length > 0) {
  console.log(`${matchedKeys.length} Matched`);
  }
  if (missingKeys.length > 0) {
  console.log(`${missingKeys.length} Missing`);
  }
  if (extraKeys.length > 0) {
  console.log(`${extraKeys.length} Extra`);
  }
  if (envDuplicates.length > 0) {
  console.log(`${envDuplicates.length} Duplicates in .env`);
  }
  if (exampleDuplicates.length > 0) {
  console.log(`${exampleDuplicates.length} Duplicates in .env.example`);
  }
  if (envEmptyKeys.length > 0) {
  console.log(`${envEmptyKeys.length} Empty Keys in .env`);
  }
  if (exampleEmptyKeys.length > 0) {
  console.log(`${exampleEmptyKeys.length} Empty Keys in .env.example`);
  }

  

}

module.exports = report;