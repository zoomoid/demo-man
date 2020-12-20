const logger = require("./logger");
const axios = require("axios").default;
const db = require("./db");

/** Given the color as a 3-element array, invert the color tuple */
const invert = (color) => {
  try {
    return color.map((t) => 255 - t);
  } catch (err) {
    logger.warn("Error inverting color tuple", { error: err });
    return color;
  }
};

const colorToString = (color = [0, 0, 0]) => {
  return `${color[0]}, ${color[1]}, ${color[2]}`;
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
 * @param {mongodb.ObjectID} id mongodb namespace id
 * @param {String} url picasso API endpoint
 */
const palette = (ns, fn, id, url) => {
  logger.info("Requesting color palette from picasso", {
    url: url,
    track: fn,
    namespace: ns,
  });
  return picassoHook(fn, url)
    .then(({ palette }) => {
      logger.debug(
        "picasso responded with palette: %s",
        JSON.stringify(palette)
      );
      let computedTheme = {
        color: colorToString(palette[0]),
        textColor: colorToString(invert(palette[0])),
        palette: palette.map((c) => colorToString(c)),
      };
      return db
        .get()
        .findOneAndUpdate(
          { type: "Namespace", name: ns },
          { $set: { computedTheme } }
        )
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
