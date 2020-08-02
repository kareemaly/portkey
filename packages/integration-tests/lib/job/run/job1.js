module.exports = (store, { buildId }) => ({
  prepare: () => {},
  steps: [
    {
      name: "Build",
      run: () => console.log("Building frontend")
    },
    {
      name: "Deploy",
      run: () => console.log("Deploying frontend")
    }
  ]
});
