const actions = require("../actions");
const runJobHandler = require("./runJobHandler");
const storeJobHandler = require("./storeJobHandler");

module.exports = store => {
  store.listen(actions.RUN_JOB, {}, runJobHandler(store));
  store.listen(actions.ADD_JOB, {}, storeJobHandler(store));
};
