const { guard, db, validator, logger } = require("../../util");

module.exports = function (router) {
  router
    .route("/namespaces/metadata")
    /**
     * Updates the metadata to a given namespace
     */
    .patch(guard, validator.metadata, ({ body }, response) => {
      db.get()
        .findOneAndUpdate(
          {
            type: "Namespace",
            name: body.namespace,
          },
          {
            $set: {
              metadata: body.metadata,
              lastUpdated: new Date().toLocaleString("de-DE"),
            },
          },
          {
            upsert: false,
            returnNewDocument: true,
          }
        )
        .then((resp) => {
          if (resp) {
            logger.info("Updated metadata for namespace", {
              for: body.namespace,
            });
            response.status(200).json({
              message: "success",
            });
          } else {
            logger.warn("Could not find namespace", {
              namespace: body.namespace,
            });
            response.status(404).json({ message: "Not found" });
          }
        })
        .catch((err) => {
          logger.error("Received error from MongoDB", {
            in: "PATCH /namespaces/metadata",
            error: err,
          });
          response.status(500).json({ message: "Interal Server Error" });
        });
    });

  router.route("/namespaces/:namespace/metadata").get((req, res) => {
    db.get()
      .findOne(
        { type: "Namespace", name: req.params.namespace },
        { metadata: 1, name: 1, url: 1, lastUpdated: 1 }
      )
      .then((resp) => {
        if (resp) {
          res.status(200).json({
            ...resp.metadata,
            name: resp.name,
            url: resp.url,
            lastUpdated: resp.lastUpdated,
          });
        } else {
          logger.warn("Could not find namespace", {
            namespace: req.params.namespace,
          });
          res.status(404).json({ message: "Not Found" });
        }
      })
      .catch((err) => {
        logger.error("Failed to load metadata for namespace", {
          namespace: req.params.namespace,
          error: err,
          in: "GET /namespaces/:namespace/metadata",
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
