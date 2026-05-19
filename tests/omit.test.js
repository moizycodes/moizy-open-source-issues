const omit = require('../utils/omit');

const user = {
  id: 1,
  name: 'Moeez',
  email: 'moeez@gmail.com',
  password: 'secret123'
};

console.log(
  omit(user, ['password'])
);

console.log(
  omit(user, ['email', 'password'])
);

console.log(
  omit({}, ['a'])
);

console.log(
  omit(null, ['password'])
);

console.log(
  omit({ a: 1 }, [])
);