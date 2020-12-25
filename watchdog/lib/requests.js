const path = require("path");
const { logger, http } = require("../util");
const { apiEndpoint } = require("../constants");

/**
 * Requests deletion of a previously added audio file
 * @param {string} p path of the audiofile to delete the track for
 */
function removeTrack(p) {
  return http.remove(`${apiEndpoint}/tracks`, { path: p })
    .then(() => {
      logger.verbose(`Deleted Track/${path.basename(p)}`);
    })
    .catch((err) => {
      logger.error(`Failed to delete Track/${path.basename(p)}`);
      logger.debug(err);
    });
}

/**
 * Requests deletion of a previously added album
 * @param {string} namespace namespace to delete
 */
function removeNamespace(namespace) {
  return http.remove(`${apiEndpoint}/namespaces`, { namespace: namespace })
    .then(() => {
      logger.verbose(`Deleted Namespace/${namespace}`);
    })
    .catch((err) => {
      logger.error(`Failed to delete Namespace/${namespace}`);
      logger.debug(err);
    });
}

/**
 * Requests creation of a new album
 * @param {string} namespace album title
 */
function addNamespace(namespace) {
  return http.add(`${apiEndpoint}/namespaces`, { namespace })
    .then(() => {
      logger.verbose(`Created Namespace/${namespace}`);
    })
    .catch((err) => {
      logger.error(`Failed to create Namespace/${namespace}`);
      logger.debug(err);
    });
}

/**
 * Requests creation of a new track
 * @param {*} track track data to post to the API
 */
function addTrack(track) {
  return http.add(`${apiEndpoint}/tracks`, { track: track })
    .then(() => {
      logger.verbose(`Added Track/${track.metadata.name}`);
    })
    .catch((err) => {
      logger.error(`Failed to create Track/${track.metadata.name}`);
      logger.debug(err);
    });
}

/**
 * Requests an update to a namespace's data
 * @param {Object} metadata namespace metadata object
 * @param {string} namespace namespace
 */
function changeMetadata(metadata, namespace) {
  return http.change(`${apiEndpoint}/namespaces/metadata`, {
    namespace,
    ...metadata,
  })
    .then(() => {
      logger.verbose(`Updated Namespace/${namespace}`);
    })
    .catch((err) => {
      logger.error(`Failed to update Namespace/${namespace}`);
      logger.debug(err);
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
