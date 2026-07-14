class RateLimiter {
  constructor(limit, duration) {
    if (
      typeof limit !== 'number' ||
      typeof duration !== 'number' ||
      limit <= 0 ||
      duration <= 0
    ) {
      throw new RangeError('RateLimiter: limit and duration must be positive numbers');
    }

    this.limit = limit;
    this.duration = duration;
    this.requests = [];
  }

  allow() {
    const currentTime = Date.now();

    // Remove expired timestamps
    this.requests = this.requests.filter(
      (timestamp) => currentTime - timestamp < this.duration
    );

    // Check if request limit reached
    if (this.requests.length >= this.limit) {
      return false;
    }

    // Store current request timestamp
    this.requests.push(currentTime);

    return true;
  }

  remainingRequests() {
    const currentTime = Date.now();

    this.requests = this.requests.filter(
      (timestamp) => currentTime - timestamp < this.duration
    );

    return this.limit - this.requests.length;
  }
}

module.exports = RateLimiter;