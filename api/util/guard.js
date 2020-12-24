const {logger} = require("./logger");
/**
 * A very simply express.js route guard middleware which just compares a sent token against an expected one.
 * Neither uses atomic comparison of passwords nor does it cover all expected cases.
 * It works on a best-effort strategy.
 */
module.exports = function (request, response, next) {
  if (!process.env.TOKEN) {
    logger.error("No token provided as ENV variable");
    response.status(500).json({ error: "Error while searching for API Token" });
    process.exit(1);
  }
  if (request.headers.authorization) {
    const auth = new Buffer.from(
      request.headers.authorization.substring(6),
      "base64"
    )
      .toString()
      .split(":");
    if (
      auth[0] &&
      auth[0] === "watchdog" &&
      auth[1] &&
      auth[1] === process.env.TOKEN
    ) {
      next();
    } else {
      logger.error("Received unauthorized request");
      response.status(401).json({ error: "Unauthorized" });
    }
  } else {
    logger.error("Received unauthorized request");
    response.status(401).json({ error: "Unauthorized" });
  }
};
