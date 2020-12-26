const { logger, failedAssociated } = require("./logger");
const axios = require("axios").default;
const db = require("./db");

/** 
 * Given the color as a 3-element array, invert the color tuple
 * @param {Array} color List of 8-bit RGB color components
 */
const invert = (color) => {
  try {
    return color.map((t) => 255 - t);
  } catch (err) {
    logger.warn("Error inverting color tuple");
    logger.debug(err);
    return color;
  }
};

/**
 * Query picasso with a given file URL and resolve with the color palette
 * @param {string} path cover filename
 * @param {string} url picasso endpoint
 */
const picassoHook = async (path, url) => {
  logger.verbose("Requesting color palette from picasso", {
    url,
    path,
  });
  return axios
    .post(url, {
      url: path,
    })
    .then(({ data }) => {
      logger.verbose("Calculated Theme", { data });
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * Manages theme creation and negotiation with picasso
 * @param {Object} track track data
 * @param {String} url picasso API endpoint
 */
const palette = (track, url) => {
  const path = `${track.metadata.namespace}/${track.data.cover.filename}`;
  return picassoHook(path, url)
    .then((theme) => {
      return db.get().findOneAndUpdate(
        {
          type: "Theme",
          "metadata.namespace": track.metadata.namespace,
          "metadata.name": track.metadata.namespace + "-theme",
          "metadata.updatedAt": new Date().toUTCString(),
        },
        {
          $set: { "data.computedTheme": theme },
          $inc: {
            "metadata.revision": 1,
          },
        },
        {
          returnOriginal: false,
        }
      );
    })
    .then((theme) => {
      db.get().findOneAndUpdate(
        {
          _id: theme._id,
        },
        {
          $set: {
            "metadata.last-applied-configuration": JSON.stringify(theme),
          },
        }
      );
    })
    .then(() => {
      logger.verbose(`Updated Theme/${track.metadata.namespace}-theme`);
    })
    .catch((err) => {
      failedAssociated({
        action: "update",
        resource: "Theme",
        namespace: track.metadata.namespace,
      });
      logger.debug(err);
    });
};

module.exports = {
  palette,
  picassoHook,
  invert,
};
