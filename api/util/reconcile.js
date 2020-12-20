const logger = require("./logger");

function WavemanError(track, message, fileName, lineNumber) {
  var instance = new Error(message, fileName, lineNumber);
  instance.track = track;
  Object.setPropertyOf(instance, Object.getPrototypeOf(this));
  if (Error.captureStackTrace) {
    Error.captureStackTrace(instance, WavemanError);
  }
  return instance;
}

WavemanError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});

if (typeof Object.setPropertyOf != "undefined") {
  Object.setPrototypeOf(WavemanError, Error);
} else {
  WavemanError.__proto__ = Error;
}

function reconcile({ f, params, reconciles }) {
  const waitTimeFactor = Math.random() * (Math.pow(2, reconciles) - 1); // BEB factor, BEB base rate is 1sec in our scenario
  logger.debug("Reconcile run %d on %s", reconciles, f);
  setTimeout(() => {
    f(params.path, params.url).catch(() => {
      reconcile({
        f,
        params,
        reconciles: reconciles + 1,
      });
    });
  }, 1000 * waitTimeFactor);
}

module.exports = {
  reconcile,
  WavemanError,
};
