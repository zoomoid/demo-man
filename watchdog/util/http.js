const axios = require("axios").default;
const logger = require("@occloxium/log").v2;
const { token } = require("../constants");

/**
 * Shorthand function for HTTP POST requests
 * @param {string} ep Endpoint URL
 * @param {*} data data to post
 */
function add(ep, data) {
  return request("POST", ep, data);
}

/**
 * Shorthand function for HTTP DELETE request
 * @param {string} ep endpoint url
 * @param {*} data data to delete
 */
function remove(ep, data) {
  return request("DELETE", ep, data);
}

/**
 * Shorthand function for HTTP PATCH request
 * @param {string} ep endpoint url
 * @param {*} data data to delete
 */
function change(ep, data) {
  return request("PATCH", ep, data);
}

/**
 * Your generic http wrapper using axios
 * @param {string} method http method
 * @param {string} ep endpoint url
 * @param {*} data data object to be posted
 */
function request(method, endpoint, data) {
  if (!process.env.DRY_RUN) {
    return axios({
      url: endpoint,
      auth: {
        username: "watchdog",
        password: token,
      },
      method,
      data,
    })
      .then(({data}) => {
        return data;
      })
      .catch((err) => {
        logger.error("Received error from API server", {
          response: err,
          endpoint: `${endpoint}`,
        });
      });
  } else {
    logger.verbose("Dry run - Not sending request to API server", {
      endpoint: `${endpoint}`,
      data: data,
    });
    return Promise.resolve({
      success: true,
      dryRun: true,
      data: data,
    });
  }
}

module.exports = {
  add,
  remove,
  change,
};
