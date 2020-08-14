const logger = require("@zoomoid/log");
const { add, remove } = require("../util/http");
const { apiEndpoint } = require("../index");

/**
 * Requests deletion of a previously added audio file
 * @param {string} path path of the audio file to query the DB with
 */
async function removeTrack(path) {
  logger.info("Deleting track...", "track", path, "endpoint", apiEndpoint);
  const resp = await remove(`${apiEndpoint}/track`, { path: path });
  if (resp && resp.status == 200) {
    logger.info(
      "Deleted track",
      "track",
      `${p.basename(path)}`,
      "response",
      resp
    );
  } else {
    logger.error(
      "Received error status from API",
      "level",
      "removeTrackFromAPI",
      "response",
      resp
    );
  }
}

/**
 * Requests deletion of a previously added album
 * @param {*} path directory name that we need to delete
 */
async function removeNamespace(ns) {
  logger.info(
    "Deleting namespace...",
    "namespace",
    ns,
    "endpoint",
    apiEndpoint
  );
  const resp = await remove(`${apiEndpoint}/namespace`, { namespace: ns });
  if (resp && resp.status == 200) {
    logger.info("Deleted namespace", "namespace", ns, "response", resp);
  } else {
    logger.error(
      "Received error status from API",
      "level",
      "removeNamespaceFromAPI",
      "response",
      resp
    );
  }
}

/**
 * Requests creation of a new album
 * @param {string} album album title
 */
async function addNamespace(namespace) {
  logger.info(
    "Adding namespace...",
    "namespace",
    namespace,
    "endpoint",
    apiEndpoint
  );
  const resp = await add(`${apiEndpoint}/namespace`, { namespace });
  if (resp && resp.status == 200) {
    logger.info("Added namespace", "namespace", namespace, "response", resp);
  } else {
    logger.error(
      "Received error status from API",
      "namespace",
      namespace,
      "level",
      "postNamespaceToAPI",
      "response",
      resp
    );
  }
}

/**
 * Requests creation of a new track
 * @param {*} track track data to post to the API
 */
async function addTrack(track) {
  logger.info(
    "Adding track...",
    "track",
    track.filename,
    "endpoint",
    apiEndpoint
  );
  const resp = await add(`${apiEndpoint}/track`, { track: track });
  if (resp && resp.status == 200) {
    logger.info("Added track", "track", track.filename, "response", resp);
  } else {
    logger.error(
      "Received error status from API",
      "track",
      track.filename,
      "level",
      "postTrackToAPI",
      "response",
      resp
    );
  }
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
};
