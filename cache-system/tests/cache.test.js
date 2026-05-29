const Cache = require('../Cache');

const cache = new Cache();

cache.set('user', {
  id: 1,
  name: 'Moeez'
});

console.log(cache.get('user'));

console.log(cache.has('user'));

cache.delete('user');

console.log(cache.get('user'));

cache.set('key1', 'value1');
cache.set('key2', 'value2');

console.log(cache.size());

cache.clear();

console.log(cache.size());

cache.set('token', 'abc123', 500);

setTimeout(() => {
  console.log(cache.get('token'));
  console.log(cache.has('token'));
}, 600);

cache.set('emptyValue', undefined);

console.log(cache.has('emptyValue'));
console.log(cache.get('emptyValue'));

cache.set('nullValue', null);

console.log(cache.has('nullValue'));
console.log(cache.get('nullValue'));