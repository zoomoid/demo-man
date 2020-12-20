const logger = require("./logger");
const fetch = require("node-fetch");

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

function reconcile({ payload, url, method, reconciles }) {
  const waitTimeFactor = Math.random() * (Math.pow(2, reconciles) - 1); // BEB factor, BEB base rate is 1sec in our scenario
  setTimeout(() => {
    fetch(url, {
      method,
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        if (resp.ok) {
          return resp;
        } else {
          throw new WavemanError(
            payload.url,
            "wave-man responded unexpectedly"
          );
        }
      })
      .catch((err) => {
        logger.error(err.message, {
          path: payload.url,
          waveman: url,
          error: err,
        });
        reconcile({
          payload,
          url,
          method,
          reconciles: reconciles + 1,
        });
      });
  }, 1000 * waitTimeFactor);
}

module.exports = {
  reconcile,
  WavemanError,
};
