const get = require('../utils/get');

const user = {
  profile: {
    address: {
      city: 'Lahore'
    },
    age: 22,
    active: false
  }
};

console.log(get(user, 'profile.address.city'));

console.log(get(user, 'profile.age'));

console.log(get(user, 'profile.active'));

console.log(get(user, 'profile.missing', 'default'));

console.log(get(user, ['profile', 'address', 'city']));

console.log(get(null, 'profile.address.city', 'not found'));

console.log(get(undefined, 'profile.address.city', 'not found'));

console.log(get({}, 'a.b.c', 'default'));

console.log(get(user, '', 'empty path'));

console.log(get(user, null, 'invalid path'));

console.log(get(user, 'profile.address.country'));

const originalUser = {
  profile: {
    name: 'Naveen'
  }
};

get(originalUser, 'profile.name');

console.log(originalUser);