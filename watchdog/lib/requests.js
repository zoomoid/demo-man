const logger = require("@zoomoid/log").v2;
const path = require("path");
const { add, remove } = require("../util/http");
const { apiEndpoint } = require("../index");

/**
 * Requests deletion of a previously added audio file
 * @param {string} p path of the audio file to query the DB with
 */
async function removeTrack(p) {
  logger.info("Deleting track...", {"track": p, "endpoint": apiEndpoint});
  const resp = await remove(`${apiEndpoint}/track`, { path: p });
  if (resp && resp.status == 200) {
    logger.info("Deleted track", {"track": `${path.basename(path)}`});
  } else {
    logger.error("Received error status from API", {"track": `${path.basename(path)}`, "in": "removeTrack", "response": resp});
  }
}

/**
 * Requests deletion of a previously added album
 * @param {*} path directory name that we need to delete
 */
async function removeNamespace(ns) {
  logger.info("Deleting namespace...", {"namespace": ns, "endpoint": apiEndpoint});
  const resp = await remove(`${apiEndpoint}/namespace`, { namespace: ns });
  if (resp && resp.status == 200) {
    logger.info("Deleted namespace", {"namespace": ns});
  } else {
    logger.error("Received error status from API", {"namespace": ns, "in": "removeNamespace", "response": resp});
  }
}

/**
 * Requests creation of a new album
 * @param {string} album album title
 */
async function addNamespace(namespace) {
  logger.info("Adding namespace...", {"namespace": namespace, "endpoint": apiEndpoint});
  const resp = await add(`${apiEndpoint}/namespace`, { namespace });
  if (resp && resp.status == 200) {
    logger.info("Added namespace", {"namespace": namespace});
  } else {
    logger.error("Received error status from API", {"namespace": namespace, "in": "addNamespace", "response": resp});
  }
}

/**
 * Requests creation of a new track
 * @param {*} track track data to post to the API
 */
async function addTrack(track) {
  logger.info("Adding track...", {"track": track.filename, "endpoint": apiEndpoint});
  const resp = await add(`${apiEndpoint}/track`, { track: track });
  if (resp && resp.status == 200) {
    logger.info("Added track", {"track": track.filename});
  } else {
    logger.error("Received error status from API", { "namespace": track.filename, "in": "addTrack", "response": resp });
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
