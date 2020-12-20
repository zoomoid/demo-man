const logger = require("./logger");
const axios = require("axios").default;
const db = require("./db");

/** Given the color as a 3-element array, invert the color tuple */
const invert = (color) => {
  try {
    logger.debug(color);
    return color.map((t) => 255 - t);
  } catch (err) {
    logger.warn("Error inverting color tuple", { error: err });
    return color;
  }
};

/**
 * Query picasso with a given file URL and resolve with the color palette
 */
const picassoHook = async (path, url) => {
  return axios
    .post(url, {
      url: path,
    })
    .then(({ data }) => {
      logger.info("picasso calculated palette", { path: path });
      return data;
    })
    .catch((err) => {
      logger.error(err.message, {
        path: path,
        picasso: url,
        error: err,
      });
      throw new Error(path, "picasso responded unexpectedly");
    });
};

/**
 * Manages theme creation and negotiation with picasso
 * @param {String} ns namespace of the track
 * @param {String} fn filename of the mp3
 * @param {mongodb.ObjectID} id mongodb track id
 * @param {String} url picasso API endpoint
 */
const palette = (ns, fn, id, url) => {
  logger.info("Requesting color palette from picasso", {
    url: url,
    track: fn,
    namespace: ns,
  });
  return picassoHook(fn, url)
    .then((palette = []) => {
      logger.debug("picasso responded with palette");
      logger.debug(palette);
      logger.debug(palette[0]);
      let computedTheme = {
        color: palette[0],
        textColor: invert(palette[0]),
        palette: palette,
      };
      return db
        .get()
        .findOneAndUpdate({ namespace: ns, _id: id }, { computedTheme })
        .catch((err) => {
          throw err;
        });
    })
    .then(() => {
      logger.info("Added calculated theme to database", {
        track: fn,
        namespace: ns,
      });
    })
    .catch((err) => {
      console.error(err);
      logger.error("Error on inserting theme into database", { error: err });
    });
};

module.exports = {
  palette,
  picassoHook,
  invert,
};
