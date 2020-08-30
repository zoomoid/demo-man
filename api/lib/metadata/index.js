const { guard, db, validator } = require("../../util");
const logger = require("@zoomoid/log").v2;

module.exports = function (router) {
  router
    .route("/namespace/metadata")
    /**
     * Updates the metadata to a given namespace
     */
    .patch(guard, validator.metadata, ({ body }, response) => {
      db.get()
        .findOneAndUpdate(
          {
            type: "Namespace",
            name: body.metadata.namespace,
          },
          {
            metadata: body.metadata,
            lastUpdated: new Date().toLocaleDateString("de-DE"),
          }
        )
        .then((resp) => {
          if (resp) {
            logger.info("Updated metadata for namespace", {
              for: body.metadata.namespace,
              metadata: body.metadata,
            });
            response.status(200).json({
              message: "success",
            });
          } else {
            logger.warn("Could not find namespace", {
              for: body.namespace,
              metadata: body.namespace,
            });
            response.status(404).json({ message: "Not found" });
          }
        })
        .catch((err) => {
          logger.error("Received error from MongoDB", {
            in: "PATCH /namespace/metadata",
            error: err,
          });
          response.status(500).json({ message: "Interal Server Error" });
        });
    });
};
