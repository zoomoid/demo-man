const { guard, db } = require("../../util");
const logger = require("@zoomoid/log").v2;

module.exports = function (router) {
  router
    .route("/namespace/metadata")
    .patch(guard, (request, response, next) => {});
};
