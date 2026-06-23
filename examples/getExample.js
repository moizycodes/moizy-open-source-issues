const get = require('../utils/get');

const apiResponse = {
  user: {
    profile: {
      address: {
        city: 'Kingston'
      }
    }
  }
};

console.log(get(apiResponse, 'user.profile.address.city'));
console.log(get(apiResponse, 'user.profile.age', 25));
console.log(get(apiResponse, ['user', 'profile', 'address', 'city']));