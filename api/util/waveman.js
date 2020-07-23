const logger = require("@zoomoid/log");
const fetch = require("node-fetch");
const db = require("./db");

/**
 * Query the waveman url with a given path and resolve with the svg data in question
 */
const wavemanHook = async (path, url) => {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        url: path,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        logger.info("wave-man rendered audio waveform", "path", path);
        resolve(res);
      })
      .catch((err) => {
        logger.error(
          "wave-man responded unexpectedly",
          "error",
          err,
          "path",
          path,
          "waveman",
          url
        );
        reject(err);
      });
  });
};

/**
 * Manages waveform creation and negotiation with the waveman
 * @param {String} ns namespace of the track
 * @param {String} fn filename of the mp3
 * @param {mongodb.ObjectID} id mongodb track id
 * @param {String} url waveman API endpoint
 */
const waveform = async (ns, fn, id, url) => {
  const path = `${ns}/${fn}`;
  logger.info(
    "Requesting waveform from wave-man",
    "url",
    url,
    "track",
    fn,
    "namespace",
    ns
  );
  let svg = await wavemanHook(path, url);
  let waveform = {
    type: "Waveform",
    namespace: ns,
    track_id: id,
    full: svg.full,
    small: svg.small,
  };
  // Async and detached from current request, as this
  // can take quite some while depending on the node the waveman was scheduled on.
  try {
    let res = await db.get().insertOne(waveform);
    logger.info("Added waveform to DB", "track", fn, "namespace", ns);
    return res;
  } catch (err) {
    console.error(err);
    logger.error("Error on inserting waveform into DB", "response", err);
  }
};

module.exports = {
  waveform: waveform,
  wavemanHook: wavemanHook,
};
