const logger = require("./logger");
const fetch = require("node-fetch");
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

/**
 * Query picasso with a given file URL and resolve with the color palette
 */
const picassoHook = async (path, url) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({
      url: path,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => {
      if (resp.ok) {
        logger.info("picasso calculated colors", { path: path });
        return resp.json();
      } else {
        throw new Error(path, "picasso responded unexpectedly");
      }
    })
    .catch((err) => {
      logger.error(err.message, {
        path: path,
        waveman: url,
        error: err,
      });
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
  const path = `${ns}/${fn}`;
  logger.info("Requesting color palette from picasso", {
    url: url,
    track: fn,
    namespace: ns,
  });
  return picassoHook(path, url)
    .then((palette) => {
      let computedTheme = {
        color: palette[0],
        textColor: invert(palette[0]),
        palette: palette.slice(1),
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
      logger.info("Error on inserting theme into database", { error: err });
    });
};

module.exports = {
  palette,
  picassoHook,
  invert,
};
