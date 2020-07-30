const _ = require("lodash");

class InMemoryStore {
  constructor() {
    this.storage = {};
  }

  set(path, value) {
    _.set(this.storage, path, value);
  }

  get(path, defaultValue) {
    _.get(this.storage, path, defaultValue);
  }
}

module.exports = InMemoryStore;
