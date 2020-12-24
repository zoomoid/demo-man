const { db, logger, failedAssociated } = require("../../util");
const { api } = require("../../endpoints");

module.exports = function (router) {
  /**
   * READ theme associated with a namespace from the API
   */
  router.get("/namespaces/:namespace/theme", ({ params }, res) => {
    db.get()
      .findOne({
        type: "Theme",
        "metadata.namespace": params.namespace,
        "metadata.name": params.namespace + "-theme",
      })
      .then((theme) => {
        if (theme) {
          res.status(200).json({
            links: {
              self: `${api.url}/namespaces/${params.namespace}/theme`,
              namespace: `${api.url}/namespaces/${params.namespace}`,
            },
            theme,
          });
        } else {
          logger.warn("Could not find Theme", {
            namespace: params.namespace,
          });
          res.status(404).json({ message: "Not Found" });
        }
      })
      .catch((err) => {
        failedAssociated({action: "read", "resource": "Theme", namespace: params.namespace});
        logger.debug(err);
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
