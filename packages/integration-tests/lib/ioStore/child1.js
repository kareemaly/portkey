#!/bin/node
const { reCreateStore } = require("@portkey/store");

async function child1(normalizedStore) {
  try {
    const store = await reCreateStore(normalizedStore);
    store.dispatch({
      action: "PLAY_SONG",
      payload: {
        songId: 123
      }
    });
    await store.waitFor("SONG_PLAYED", { songId: 123 }, 100);
    console.log("COMMUNICATION SUCCESSFULL");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const { normalizedStore } = JSON.parse(process.argv[process.argv.length - 1]);

child1(normalizedStore);
