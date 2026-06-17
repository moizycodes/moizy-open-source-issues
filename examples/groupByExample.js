const groupBy = require('../utils/groupBy');

const products = [
  { name: 'Laptop', category: 'electronics' },
  { name: 'Phone', category: 'electronics' },
  { name: 'Shirt', category: 'clothing' }
];

const groupedByCategory = groupBy(products, 'category');

console.log(groupedByCategory);

const groupedByCallback = groupBy(products, (product) => product.category);

console.log(groupedByCallback);