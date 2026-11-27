const TaskQueue = require('../utils/TaskQueue');

const queue = new TaskQueue();

queue.add(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('First task completed');
});

queue.add(async () => {
  console.log('Second task completed');
});

queue.process();