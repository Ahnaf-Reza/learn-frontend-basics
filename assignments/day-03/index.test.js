/**
 * 1. Promise.allSettled Polyfill
 * - Returns a promise that resolves after all of the given promises have either fulfilled or rejected.
 * - Result is an array of objects describing the outcome of each promise.
 */
function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    const results = [];
    let completedCount = 0;

    if (promises.length === 0) {
      resolve(results);
      return;
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => {
          results[index] = { status: "fulfilled", value };
          completedCount++;
          if (completedCount === promises.length) resolve(results);
          })
          .catch((reason) => {
            results[index] = { status: "rejected", reason };
            completedCount++;
            if (completedCount === promises.length) resolve(results);
          });
    });

  });
}

/**
 * 2. Retry with Exponential Backoff
 * - Retries the function `fn` up to `retries` times.
 * - Helper: Use `setTimeout` within a Promise for delay.
 */
function retry(fn, retries = 3, delay = 1000) {
  return async (...args) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (i === retries - 1) throw error;
      }
      
      await new Promise((res) => setTimeout(res, delay)); 
    }
  };
}

/**
 * 3. Async Queue
 * - Manages a limited number of concurrent tasks.
 */
class AsyncQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.next();
    });
  }

  // Helper to run next task
  next() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const { task, resolve, reject } = this.queue.shift();
    this.running++;

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        this.running--;
        this.next();
      });
  }
}

module.exports = { promiseAllSettled, retry, AsyncQueue };
