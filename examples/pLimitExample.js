const pLimit = require('../utils/pLimit');

const limit = pLimit(2);

const fetchData = async (id) => {
  console.log(`Starting task ${id}`);

  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  console.log(`Finished task ${id}`);

  return `Result ${id}`;
};

const tasks = [
  () => fetchData(1),
  () => fetchData(2),
  () => fetchData(3),
  () => fetchData(4)
];

Promise.all(tasks.map((task) => limit(task))).then((results) => {
  console.log(results);
});