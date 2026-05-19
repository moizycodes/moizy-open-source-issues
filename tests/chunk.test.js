const chunk = require('../utils/chunk');

console.log(
  chunk([1, 2, 3, 4, 5, 6], 2)
);

console.log(
  chunk([1, 2, 3, 4, 5], 2)
);

console.log(
  chunk([], 2)
);

console.log(
  chunk([1, 2], 5)
);

console.log(
  chunk(null, 2)
);

console.log(
  chunk([1, 2, 3], 0)
);