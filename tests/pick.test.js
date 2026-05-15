const pick = require('../utils/pick');

const user = {
  id: 1,
  name: 'Moeez',
  email: 'moeez@gmail.com',
  password: '123456'
};

console.log(pick(user, ['id', 'name']));
console.log(pick(user, ['email']));
console.log(pick({}, ['a']));
console.log(pick(null, ['a']));