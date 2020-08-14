const logger = require("@zoomoid/log");

/** API Server endpoint to query */
const apiEndpoint = process.env.API_ENDPOINT || "http://demo-api/api/v1/demo";
/** basic auth token that the watchdog has to append to a request to the API server */
const token = process.env.TOKEN;
/** basic volume cwd of the watchdog */
const volume = process.env.VOLUME || ".";
/**  */
const url = JSON.parse(process.env.PUBLIC_PATH) || {
  prefix: "https",
  hostname: "demo.zoomoid.de",
  dir: "files/",
};

if (!process.env.TOKEN) {
  logger.warn(
    "No API token provided. Protected routes will not work properly."
  );
}

logger.info("Watching directory", "volume", volume);

module.exports = {
  token,
  volume,
  url,
  apiEndpoint,
};
