module.exports = {
  guard: require("./guard"),
  waveform: require("./waveman").waveform,
  wavemanHook: require("./waveman").wavemanHook,
  picassoHook: require("./picasso").picassoHook,
  palette: require("./picasso").palette,
  db: require("./db"),
  validator: require("./validator"),
  logger: require("./logger").logger,
  failed: require("./logger").failed,
  failedAssociated: require("./logger").failedAssociated,
  dnsName: require("./dnsName"),
  pluralize: require("./pluralize"),
};
