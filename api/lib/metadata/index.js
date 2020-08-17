const { guard, db, validator } = require("../../util");
const logger = require("@zoomoid/log").v2;

module.exports = function (router) {
  router
    .route("/namespace/metadata")
    /**
     * Updates the metadata to a given namespace
     */
    .patch(guard, validator.metadata, (request, response) => {
      db.get().findOneAndUpdate({
        type: "Namespace",
        name: request.body.namespace,
      }, {
        metadata: request.body.metadata,
        lastUpdated: new Date().toLocaleDateString("de-DE"),
      }).then((resp) => {
        if(resp){
          logger.info("Updated metadata for namespace", {
            for: request.body.namespace,
            metadata: request.body.namespace,
          });
          response.status(200).json({
            response: resp,
          });
        } else {
          logger.warn("Could not find namespace", {
            for: request.body.namespace,
            metadata: request.body.namespace,
          });
          response.status(404).send("Not found");
        }
      }).catch((err) => {
        logger.error("Received error from MongoDB", {
          in: "PATCH /namespace/metadata",
          error: err,
        });
        response.status(500).send("Interal Server Error");
      });
    });
};
