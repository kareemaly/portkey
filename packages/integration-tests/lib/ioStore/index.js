const { createStore } = require("@portkey/store");
const express = require("express");
const httpModule = require("http");
const socketIo = require("socket.io");
const { spawn } = require("child_process");
const path = require("path");

const PORT = 4997;

async function parent(io) {
  return createStore({
    serverSocket: io.of("/internal"),
    serverUrl: `http://localhost:${PORT}/internal`,
    clientConnectOptions: {
      transports: ["websocket"]
    }
  });
}

async function run() {
  const app = express();
  const http = httpModule.createServer(app);
  const io = socketIo(http);
  const store = await parent(io);
  store.listen("PLAY_SONG", null, ({ songId }) => {
    store.dispatch({ action: "SONG_PLAYED", payload: { songId } });
  });
  http.listen(PORT);
  const childProcess = spawn(
    path.resolve(__dirname, "./child1.js"),
    [
      JSON.stringify({
        normalizedStore: store.normalize()
      })
    ],
    {
      stdio: "inherit",
      timeout: 5000
    }
  );
  childProcess.on("close", code => {
    process.exit(code);
  });
}

run().catch(console.error);
