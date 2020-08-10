const createTimeoutPromise = (callback, timeout, errorMessage) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage || `Timeout ${timeout} is reached`));
    }, timeout);
    callback(resolve, reject);
  });
};

module.exports = createTimeoutPromise;
