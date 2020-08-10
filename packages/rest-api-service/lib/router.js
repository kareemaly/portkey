const express = require("express");
const { actions: jobActions } = require("@portkey/job");

module.exports = (store, { buildHistoryStorage, jobStorage }) => {
  const router = express.Router();

  router.get("/job", async (req, res, next) => {
    try {
      const data = await jobStorage.all();
      res.send({ data });
    } catch (err) {
      next(err);
    }
  });

  router.get("/job/:jobName", async (req, res, next) => {
    try {
      const data = await jobStorage.get(req.params.jobName);
      res.send({ data });
    } catch (err) {
      next(err);
    }
  });

  router.get("/build", async (req, res, next) => {
    try {
      const data = await buildHistoryStorage.query({
        jobName: req.query.jobName
      });
      res.send({ data });
    } catch (err) {
      next(err);
    }
  });

  router.get("/build/:buildId", async (req, res, next) => {
    try {
      const build = await buildHistoryStorage.get(req.params.buildId);
      res.send({ data: build });
    } catch (err) {
      next(err);
    }
  });

  router.post("/job/start", (req, res) => {
    try {
      store.dispatch(
        jobActions.runJob({
          jobName: req.body.jobName,
          viewerId: "__temp__"
        })
      );
      res.send({ ok: true });
    } catch (err) {
      res.status(500).send({
        error: err.message
      });
    }
  });

  return router;
};
