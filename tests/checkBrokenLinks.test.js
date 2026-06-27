const checkBrokenLinks = require("../utils/checkBrokenLinks");

async function runTests() {
  console.log("Test 1: Empty array");
  console.log(await checkBrokenLinks([]));

  console.log("\nTest 2: Valid URL");
  console.log(await checkBrokenLinks([
    "https://example.com"
  ]));

  console.log("\nTest 3: Invalid URL");
  console.log(await checkBrokenLinks([
    "not-a-valid-url"
  ]));

  console.log("\nTest 4: Mixed URLs");
  console.log(await checkBrokenLinks([
    "https://example.com",
    "https://httpbin.org/status/404",
    "https://httpbin.org/status/500",
    "not-a-valid-url"
  ]));
}

runTests();