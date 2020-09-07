class ValidationError extends Error {
  constructor(errors) {
    super(
      `Validation error setting up git-flow-middleware: ${JSON.stringify(
        errors,
        null,
        2
      )}`
    );
    this.name = "ValidationError";
    this.errors = errors;
  }
}

module.exports = ValidationError;
