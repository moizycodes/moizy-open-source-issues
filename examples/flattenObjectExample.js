const flattenObject = require('../utils/flattenObject');

const apiResponse = {
  user: {
    id: 1,
    profile: {
      name: 'Naveen',
      location: {
        city: 'Kingston',
        country: 'Canada'
      }
    }
  }
};

const flattened = flattenObject(apiResponse);

console.log(flattened);