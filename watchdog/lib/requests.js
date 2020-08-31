const logger = require("@zoomoid/log").v2;
const path = require("path");
const { add, remove, change } = require("../util/http");
const { apiEndpoint } = require("../constants");

/**
 * Requests deletion of a previously added audio file
 * @param {string} p path of the audio file to query the DB with
 */
function removeTrack(p) {
  logger.info("Deleting track...", { track: p, endpoint: apiEndpoint });
  return remove(`${apiEndpoint}/track`, { path: p })
    .then(() => {
      logger.info("Deleted track", { track: `${path.basename(p)}` });
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        track: `${path.basename(p)}`,
        in: "removeTrack",
        error: err,
      });
    });
}

/**
 * Requests deletion of a previously added album
 * @param {*} path directory name that we need to delete
 */
function removeNamespace(namespace) {
  logger.info("Deleting namespace...", {
    namespace: namespace,
    endpoint: apiEndpoint,
  });
  return remove(`${apiEndpoint}/namespace`, { namespace: namespace })
    .then(() => {
      logger.info("Deleted namespace", { namespace: namespace });
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        namespace: namespace,
        in: "removeNamespace",
        error: err,
      });
    });
}

/**
 * Requests creation of a new album
 * @param {string} album album title
 */
function addNamespace(namespace) {
  logger.info("Adding namespace...", {
    namespace: namespace,
    endpoint: apiEndpoint,
  });
  return add(`${apiEndpoint}/namespace`, { namespace })
    .then(() => {
      logger.info("Added namespace", { namespace: namespace });
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        namespace: namespace,
        in: "addNamespace",
        error: err,
      });
    });
}

/**
 * Requests creation of a new track
 * @param {*} track track data to post to the API
 */
function addTrack(track) {
  logger.info("Adding track...", {
    track: track.filename,
    endpoint: apiEndpoint,
  });
  return add(`${apiEndpoint}/track`, { track: track })
    .then(() => {
      logger.info("Added track", { track: track.filename });
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        namespace: track.filename,
        in: "addTrack",
        error: err,
      });
    });
}

function changeMetadata(o, p, n) {
  logger.info("Metadata changed", {
    path: p,
    data: o,
  });
  return change(`${apiEndpoint}/namespace/metadata`, {
    namespace: n,
    metadata: o
  })
    .then(() => {
      logger.info("Updated namespace metadata", {
        namespace: n,
        path: p,
        data: o,
      });
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        namespace: n,
        path: p,
        in: "changeMetadata",
        error: err,
      });
    });
}

module.exports = {
  namespace: {
    add: addNamespace,
    remove: removeNamespace,
  },
  track: {
    add: addTrack,
    remove: removeTrack,
  },
  metadata: {
    change: changeMetadata,
  },
};
