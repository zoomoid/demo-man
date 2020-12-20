const logger = require("./logger");
const fetch = require("node-fetch");
const db = require("./db");
const { reconcile, WavemanError } = require("./reconcile");

/**
 * Query the waveman url with a given path and resolve with the svg data in question
 */
const wavemanHook = async (path, url) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      url: path,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => {
      if (resp.ok) {
        logger.info("wave-man rendered audio waveform", { path: path });
        return resp.json();
      } else {
        throw new WavemanError(path, "wave-man responded unexpectedly");
      }
    })
    .catch((err) => {
      logger.error(err.message, {
        path: path,
        waveman: url,
        error: err,
      });
      reconcile({
        url,
        payload: {
          url: path,
        },
        method: "POST",
        reconciles: 1,
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
const waveform = (ns, fn, id, url) => {
  const path = `${ns}/${fn}`;
  logger.info("Requesting waveform from wave-man", {
    url: url,
    track: fn,
    namespace: ns,
  });
  return wavemanHook(path, url)
    .then((svg) => {
      let waveform = {
        type: "Waveform",
        namespace: ns,
        track_id: id,
        full: svg.full,
        small: svg.small,
      };
      return db.get().insertOne(waveform);
    })
    .then(() => {
      logger.info("Added waveform to DB", { track: fn, namespace: ns });
    })
    .catch((err) => {
      logger.info("Error on inserting waveform into DB", { error: err });
    });
};

module.exports = {
  waveform: waveform,
  wavemanHook: wavemanHook,
};
