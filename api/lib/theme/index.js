const { db, logger } = require("../../util");

module.exports = function (router) {
  router.route("/namespaces/:namespace/theme").get((req, res) => {
    db.get()
      .findOne(
        { type: "Namespace", name: req.params.namespace },
        { metadata: 1, computedTheme: 1, name: 1, lastUpdated: 1 }
      )
      .then((resp) => {
        if (resp) {
          res.status(200).json({
            theme: resp.metadata.theme
              ? resp.metadata.theme
              : resp.computedTheme,
            name: resp.name,
            lastUpdated: resp.lastUpdated,
            computedTheme: resp.computedTheme,
          });
        } else {
          logger.warn("Could not find namespace", {
            namespace: req.params.namespace,
          });
          res.status(404).json({ message: "Not Found" });
        }
      })
      .catch((err) => {
        logger.error("Failed to load theme for namespace", {
          namespace: req.params.namespace,
          error: err,
          in: "GET /namespaces/:namespace/theme",
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
