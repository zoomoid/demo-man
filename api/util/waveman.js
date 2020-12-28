const { logger, failedAssociated } = require("./logger");
const db = require("./db");
const axios = require("axios").default;

/**
 * Query the waveman url with a given path and resolve with the svg data in question
 * @param {string} path filename path for waveman
 * @param {string} url waveman endpoint
 */
const hook = async (path, url) => {
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
const waveman = (waveform, track, url) => {
  const path = `${track.metadata.namespace}/${track.data.file.name}`;
  return hook(path, url)
    .then((svg) => {
      const data = {
        full: svg.full,
        small: svg.small,
      };
      return db.get().findOneAndUpdate(
        {
          type: "Waveform",
          "metadata.track_id": track._id,
        },
        {
          $set: {
            data,
          },
          $inc: {
            "metadata.revision": 1,
          },
        },
        {
          returnOriginal: false,
        }
      );
    })
    .then((waveform) => {
      if(waveform.value){
        return db.get().findOneAndUpdate(
          {
            _id: waveform.value._id,
          },
          {
            $set: {
              "metadata.lastAppliedConfiguration": JSON.stringify(waveform.value),
            },
          }
        );
      }
    })
    .then(() => {
      logger.verbose(`Updated Waveform/${waveform.metadata.name}`);
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
  waveman,
  hook,
};
