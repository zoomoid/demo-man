const { createLogger, format, transports } = require("winston");

/**
 * Generalizes database promise rejects and resource creation logging
 * @param {{action: string, resource: string, namespace: string}} s configuration object
 */
const failed = (s) => {
  logger.error(`Failed to ${s.action} ${s.resource}/${s.namespace}`);
};

/**
 * Generalizes database promise rejects and resource creation logging
 * @param {{action: string, resource: string, namespace: string}} s configuration object
 */
const failedAssociated = (s) => {
  logger.error(`Failed to ${s.action} ${s.resource}/${s.namespace}`);
};

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "api" },
  transports: [
    new transports.File({ filename: "api.error", level: "error" }),
    new transports.File({ filename: "api.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

module.exports = {
  logger,
  failed,
  failedAssociated
};
