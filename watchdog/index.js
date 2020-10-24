const logger = require("@occloxium/log").v2;
const watchers = require("./lib/watchers");
const { volume, token } = require("./constants");

if (!token) {
  logger.warn(
    "No API token provided. Protected routes will not work properly."
  );
}

logger.info("Watching directory", { volume: volume });

watchers();
