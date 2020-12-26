const { logger } = require("./util");
const watchers = require("./lib/watchers");
const { volume, token } = require("./constants");

if (!token) {
  logger.warn("No token provided. Requests to protected API routes will fail.");
}
logger.info("Watching directory %s", volume);
watchers.runWatchers(volume);
