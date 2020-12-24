const { logger, db, failedAssociated } = require("./");
const axios = require("axios").default;

/**
 * Query the waveman url with a given path and resolve with the svg data in question
 * @param {string} path filename path for waveman
 * @param {string} url waveman endpoint
 */
const wavemanHook = async (path, url) => {
  logger.verbose("Requesting waveform from waveman", {
    url,
    path,
  });
  return axios
    .post(url, {
      url: path,
    })
    .then(({ data }) => {
      logger.verbose("Rendered Waveform", { path });
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * Manages waveform creation and negotiation with the waveman
 * @param {Object} track namespace of the track
 * @param {string} url waveman API endpoint
 */
const waveform = (track, url) => {
  const path = `${track.metadata.namespace}/${track.data.filename}`;
  const waveform = {
    type: "Waveform",
    metadata: {
      name: track.metadata.name + "-waveform",
      namespace: track.metadata.namespace,
      track_id: track._id,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
      revision: 1,
    },
    data: {}, // empty data object to be filled in the promise resolve function 
  };
  return wavemanHook(path, url)
    .then((svg) => {
      waveform.data = {
        full: svg.full,
        small: svg.small,
      };
      return db.get().insertOne(waveform);
    })
    .then((waveform) => {
      return db.get().findOneAndUpdate({
        _id: waveform._id,
      }, {
        $set: {
          "metadata.last-applied-configuration": JSON.stringify(waveform),
        }
      });
    })
    .then(() => {
      logger.verbose(`Added Waveform/${waveform.metadata.name}`);
    })
    .catch((err) => {
      failedAssociated({
        action: "create",
        resource: "Waveform",
        namespace: waveform.metadata.namespace,
      });
      logger.debug(err);
    });
};

module.exports = {
  waveform: waveform,
  wavemanHook: wavemanHook,
};
