const RateLimiter = require('../rate-limiter/RateLimiter');

const limiter = new RateLimiter(3, 5000);

console.log(limiter.allow()); // true
console.log(limiter.allow()); // true
console.log(limiter.allow()); // true
console.log(limiter.allow()); // false

setTimeout(() => {
  console.log(limiter.allow()); // true after 5 seconds
}, 5000);