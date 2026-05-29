const Cache = require('../Cache');

const cache = new Cache();

cache.set('user', {
  id: 1,
  name: 'Moeez'
});

console.log(cache.get('user'));

cache.set('token', 'abc123', 1000);

console.log(cache.get('token'));

setTimeout(() => {
  console.log(cache.get('token'));
}, 1200);