function compareEnv(parsedEnv, parsedExample) {
  const envKeys = Object.keys(parsedEnv.variables);
  const exampleKeys = Object.keys(parsedExample.variables);

  const missingKeys = [];
  const extraKeys = [];
  const matchedKeys = [];

  for (const key of envKeys) {
    if (!exampleKeys.includes(key)) {
      missingKeys.push(key);
    }
    else{
        matchedKeys.push(key);
    }
  }
  for (const key of exampleKeys) {
    if (!envKeys.includes(key)) {
      extraKeys.push(key);
    }
  }
  return{
    matchedKeys,
    missingKeys,
    extraKeys
  }
}

module.exports = compareEnv;