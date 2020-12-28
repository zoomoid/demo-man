module.exports = {
  guard: require("./guard"),
  hooks: {
    waveman: require("./waveman").waveman,
    picasso: require("./picasso").picasso,
    _: {
      waveman: require("./waveman").hook,
      picasso: require("./picasso").hook,
    },
  },
  db: require("./db"),
  validator: require("./validator"),
  logger: require("./logger").logger,
  failed: require("./logger").failed,
  failedAssociated: require("./logger").failedAssociated,
  dnsName: require("./dnsName"),
  pluralize: require("./pluralize"),
};
