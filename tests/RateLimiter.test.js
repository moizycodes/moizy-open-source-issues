const RateLimiter = require('../rate-limiter/RateLimiter');

const limiter = new RateLimiter(2, 3000);

console.log('Request 1:', limiter.allow());
console.log('Request 2:', limiter.allow());
console.log('Request 3:', limiter.allow());

setTimeout(() => {
  console.log('Request after reset:', limiter.allow());
}, 3000);