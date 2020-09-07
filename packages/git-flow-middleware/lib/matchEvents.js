const get = require("lodash/get");

const satisfyEqual = (condition, hook) => {
  return get(hook, condition.selector.slice(1)) === condition.value;
};

const satisfyOneOf = (condition, hook) => {
  return condition.value.indexOf(get(hook, condition.selector.slice(1))) > -1;
};

const satisfyConditions = (conditions, hook) => {
  return conditions.every(condition => {
    return {
      equal: satisfyEqual(condition, hook),
      oneOf: satisfyOneOf(condition, hook)
    }[condition.type];
  });
};

const matchEvents = (githubEvent, hook, events) => {
  return events.find(event => {
    return (
      event.event === githubEvent && satisfyConditions(event.conditions, hook)
    );
  });
};

module.exports = matchEvents;
