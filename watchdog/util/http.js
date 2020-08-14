const fetch = require("node-fetch");
const logger = require("@zoomoid/log");
const { token } = require("../index");

/**
 * Shorthand function for HTTP POST requests
 * @param {string} ep Endpoint URL
 * @param {*} data data to post
 */
async function add(ep, data) {
  return request("POST", ep, data);
}

/**
 * Shorthand function for HTTP DELETE request
 * @param {string} ep endpoint url
 * @param {*} data data to delete
 */
async function remove(ep, data) {
  return request("DELETE", ep, data);
}

/**
 * Your generic http wrapper using node-fetch
 * @param {string} method http method
 * @param {string} ep endpoint url
 * @param {*} data data object to be posted
 */
async function request(method, ep, data) {
  try {
    if (!process.env.DRY_RUN) {
      data.token = token;
      const resp = await fetch(ep, {
        mode: "cors",
        method: method,
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return resp;
    } else {
      logger.warn(
        "Dry run! Not sending request to API server",
        "endpoint",
        `${ep}`,
        "data",
        data
      );
      return {
        success: true,
        note: "dry_run",
        data: data,
      };
    }
  } catch (err) {
    logger.error(
      "Received error from API server",
      "level",
      "__request",
      "response",
      err,
      "endpoint",
      `${ep}`
    );
  }
}

module.exports = {
  add,
  remove,
};
