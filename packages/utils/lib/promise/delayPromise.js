const delayPromise = timeout =>
  new Promise(resolve => setTimeout(resolve, timeout));

module.exports = delayPromise;
