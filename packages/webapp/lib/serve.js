const fs = require("fs");
const path = require("path");
const express = require("express");

const injectToHead = (html, content) => {
  const headIndex = html.indexOf("</head>");
  if (headIndex === -1) {
    throw new Error("no <head> tag is found in this html");
  }
  return html.slice(0, headIndex) + content + html.slice(headIndex);
};

const injectWindowVariableToHead = (html, name, value) => {
  return injectToHead(
    html,
    `<script>window['${name}'] = ${JSON.stringify(value)}</script>`
  );
};

const serve = ({ userConfig, expressApp: app }) => {
  const html = fs
    .readFileSync(path.resolve(__dirname, "../build/index.html"))
    .toString();

  const appHtml = injectWindowVariableToHead(
    html,
    "PK_USER_CONFIG",
    // @see src/config/index.js
    userConfig
  );

  function serveWebApp(req, res) {
    res.send(appHtml);
  }

  app.all("/", serveWebApp);
  app.use(express.static(path.resolve(__dirname, "../build")));
  app.all("*", serveWebApp);
};

module.exports = {
  serve
};
