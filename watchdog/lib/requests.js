const logger = require("@zoomoid/log").v2;
const path = require("path");
const { add, remove, change } = require("../util/http");
const { apiEndpoint } = require("../constants");

/**
 * Requests deletion of a previously added audio file
 * @param {string} p path of the audio file to query the DB with
 */
async function removeTrack(p) {
  logger.info("Deleting track...", { track: p, endpoint: apiEndpoint });
  return remove(`${apiEndpoint}/track`, { path: p })
    .then((resp) => {
      if (resp.ok) {
        logger.info("Deleted track", { track: `${path.basename(path)}` });
      } else {
        throw new Error(resp.statusText);
      }
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        track: `${path.basename(path)}`,
        in: "removeTrack",
        error: err,
      });
    });
}

/**
 * Requests deletion of a previously added album
 * @param {*} path directory name that we need to delete
 */
async function removeNamespace(ns) {
  logger.info("Deleting namespace...", {
    namespace: ns,
    endpoint: apiEndpoint,
  });
  return remove(`${apiEndpoint}/namespace`, { namespace: ns })
    .then((resp) => {
      if (resp.ok) {
        logger.info("Deleted namespace", { namespace: ns });
      } else {
        throw new Error(resp.statusText);
      }
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        namespace: ns,
        in: "removeNamespace",
        error: err,
      });
    });
}

/**
 * Requests creation of a new album
 * @param {string} album album title
 */
async function addNamespace(namespace) {
  logger.info("Adding namespace...", {
    namespace: namespace,
    endpoint: apiEndpoint,
  });
  return add(`${apiEndpoint}/namespace`, { namespace })
    .then((resp) => {
      if (resp.ok) {
        logger.info("Added namespace", { namespace: namespace });
      } else {
        throw new Error(resp.statusText);
      }
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
async function addTrack(track) {
  logger.info("Adding track...", {
    track: track.filename,
    endpoint: apiEndpoint,
  });
  return add(`${apiEndpoint}/track`, { track: track })
    .then((resp) => {
      if (resp.ok) {
        logger.info("Added track", { track: track.filename });
      } else {
        throw new Error(resp.statusText);
      }
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        namespace: track.filename,
        in: "addTrack",
        error: err,
      });
    });
}

async function changeMetadata(o, p) {
  logger.info("Metadata changed", {
    path: p,
    data: o,
  });
  return change(`${apiEndpoint}/namespace/metadata`, { metadata: o })
    .then((resp) => {
      if (resp.ok) {
        logger.info("Updated namespace metadata", {
          namespace: o.namespace,
          path: p,
          data: o,
        });
      } else {
        throw new Error(resp.statusText);
      }
    })
    .catch((err) => {
      logger.error("Received error status from API", {
        namespace: o.namespace,
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
