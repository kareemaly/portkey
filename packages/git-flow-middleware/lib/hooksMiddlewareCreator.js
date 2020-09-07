const Ajv = require("ajv");
const log = require("debug")("@portkey/git-flow-middleware");
const get = require("lodash/get");
const { actions: jobActions } = require("@portkey/job");
const matchEvents = require("./matchEvents");
const hooksSchema = require("./hooksSchema");
const ValidationError = require("./ValidationError");

module.exports = function hooksMiddlewareCreator({ store, hooks }) {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true });
  const validate = ajv.compile(hooksSchema);
  if (!validate(hooks)) {
    throw new ValidationError(validate.errors);
  }
  return async function hooksMiddleware(req, res, next) {
    const requestRepository = get(req.body, "repository.full_name");
    log("Github Event %s", req.get("X-Github-Event"));
    log("Github repository %s", requestRepository);
    const hook = hooks.find(
      ({ repository }) => requestRepository === repository
    );
    if (!hook) {
      return res.sendStatus(404);
    }
    log("Found hook %O", hook);
    const event = matchEvents(req.get("X-GitHub-Event"), req.body, hook.events);
    if (!event) {
      return res.sendStatus(404);
    }
    log("Found event %O", event);
    try {
      store.dispatch(
        jobActions.runJob({
          jobName: event.jobName,
          viewerId: "__temp"
        })
      );
      res.status(200).send({ ok: true });
    } catch (err) {
      log("Error %O", err);
      res.status(500).send({ err });
    }
  };
};
