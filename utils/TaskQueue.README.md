# Lightweight JavaScript Task Queue

## Features

- Sequential async task processing
- FIFO queue order
- Queue status tracking
- Graceful error handling

## Methods

### add(task)
Adds a task to the queue.

### process()
Processes queued tasks sequentially.

### size()
Returns the number of pending tasks.

### isProcessing()
Returns whether the queue is currently processing tasks.

## Example

```javascript
const TaskQueue = require('./utils/TaskQueue');

const queue = new TaskQueue();

queue.add(async () => {
  console.log('Task 1');
});

queue.process();
```