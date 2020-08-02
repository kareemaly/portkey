const error = {
  type: "object",
  required: ["code", "message"],
  properties: {
    code: { type: "number" },
    message: { type: "string" }
  }
};

module.exports = error;
