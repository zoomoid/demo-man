const fetch = require("node-fetch");
const logger = require("@zoomoid/log").v2;
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
 * Your generic http wrapper using node-fetch
 * @param {string} method http method
 * @param {string} ep endpoint url
 * @param {*} data data object to be posted
 */
function request(method, ep, data) {
  if (!process.env.DRY_RUN) {
    data.token = token;
    return fetch(ep, {
      mode: "cors",
      method: method,
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((res) => {
        if (res.ok) {
          return res;
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        logger.error("Received error from API server", {
          in: "__request",
          response: err,
          endpoint: `${ep}`,
        });
      });
  } else {
    logger.warn("Dry run! Not sending request to API server", {
      endpoint: `${ep}`,
      data: data,
    });
    return Promise.resolve({
      success: true,
      note: "dry_run",
      data: data,
    });
  }
}

module.exports = {
  add,
  remove,
  change,
};
