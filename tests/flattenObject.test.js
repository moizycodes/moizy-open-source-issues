const flattenObject = require('../utils/flattenObject');

const nestedUser = {
  user: {
    name: 'Moeez',
    address: {
      city: 'Lahore'
    }
  }
};

console.log(flattenObject(nestedUser));

console.log(flattenObject({}));

console.log(flattenObject(null));

console.log(flattenObject('invalid'));

console.log(flattenObject({
  a: {
    b: {
      c: 1
    }
  }
}));

console.log(flattenObject({
  user: {
    name: 'Ali',
    age: 25,
    active: true,
    address: null
  }
}));

console.log(flattenObject({
  product: {
    name: 'Laptop',
    tags: ['electronics', 'computer'],
    price: 1200
  }
}));

const originalObject = {
  settings: {
    theme: {
      color: 'dark'
    }
  }
};

console.log(flattenObject(originalObject));
console.log(originalObject);