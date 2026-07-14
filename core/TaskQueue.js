/**
 * Lightweight TaskQueue
 * Processes asynchronous tasks sequentially using FIFO order.
 */

class TaskQueue {
  constructor() {
    /**
     * Stores pending tasks in the order they were added.
     */
    this.queue = [];

    /**
     * Tracks whether the queue is currently processing tasks.
     */
    this.processing = false;
  }

  /**
   * Add a task to the queue.
   * @param {Function} task
   */
  add(task) {
    if (typeof task !== 'function') {
      throw new TypeError('TaskQueue.add: task must be a function');
    }

    this.queue.push(task);
  }

  /**
   * Process all queued tasks sequentially.
   * Failed tasks are skipped so the queue can continue processing.
   */
  async process() {
    if (this.processing === true) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const currentTask = this.queue.shift();

      try {
        await currentTask();
      } catch (error) {
        // Continue processing remaining tasks if one task fails.
      }
    }

    this.processing = false;
  }

  /**
   * Return the number of pending tasks.
   */
  size() {
    return this.queue.length;
  }

  /**
   * Return whether the queue is currently processing.
   */
  isProcessing() {
    return this.processing;
  }
}

module.exports = TaskQueue;