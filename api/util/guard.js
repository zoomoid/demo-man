const logger = require("@zoomoid/log");

/**
 * A very simply express.js route guard middleware which just compares a sent token against an expected one.
 * Neither uses atomic comparison of passwords nor does it cover all expected cases.
 * It works on a best-effort strategy.
 */
module.exports = function (request, response, next) {
  if (!process.env.TOKEN) {
    logger.error("No token provided as ENV variable");
    response.status(500).json({ error: "Error while authenticating" });
    process.exit(1);
  }
  if (request.body.token && request.body.token === process.env.TOKEN) {
    delete request.body.token;
    next();
  } else {
    logger.error(
      "Received unauthorized request",
      "attempted_with",
      `${request.body.token}`
    );
    response.status(401).json({ error: "Unauthorized" });
  }
};
