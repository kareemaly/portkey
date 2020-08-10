const createLocalStore = require("./createLocalStore");

describe("createLocalStore", () => {
  describe("listen/dispatch", () => {
    it("should match dispatched actions", done => {
      const store = createLocalStore();
      store.listen("run_job", { jobName: "foo" }, () => {
        done();
      });
      store.dispatch("run_job", { jobName: "foo" });
    });
    it("should be called with payload", done => {
      const store = createLocalStore();
      const payload = { jobName: "foo", another: "bar" };
      store.listen("run_job", { jobName: "foo" }, () => {
        expect(payload).toEqual(payload);
        done();
      });
      store.dispatch("run_job", payload);
    });
  });
  describe("waitFor/dispatch", () => {
    it("should wait for dispatched actions", done => {
      const store = createLocalStore();
      store.waitFor("run_job", { jobName: "foo" }, 10).then(() => {
        done();
      });
      store.dispatch("run_job", { jobName: "foo" });
    });
    it("should fail with timeout", done => {
      const store = createLocalStore();
      store.waitFor("run_job", { jobName: "foo" }, 10).catch(err => {
        expect(err.message).toEqual("Timeout Error");
        done();
      });
      store.dispatch("run_job_1", { jobName: "foo" });
      store.dispatch("run_job", { jobName: "other" });
    });
  });
});
