const checkBrokenLinks = require("../utils/checkBrokenLinks");

async function main() {
  const urls = [
    "https://example.com",
    "https://httpbin.org/status/404",
    "https://httpbin.org/status/500",
    "not-a-valid-url"
  ];

  const results = await checkBrokenLinks(urls);

  console.log(results);
}

main();