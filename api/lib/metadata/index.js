const { api } = require("../../endpoints");
const {
  guard,
  db,
  validator,
  logger,
  failedAssociated,
  failed,
} = require("../../util");

module.exports = function (router) {
  /**
   * UPDATE the metadata to a specified namespace
   */
  router.patch(
    "/namespaces/metadata",
    guard,
    validator.metadata,
    ({ body }, response) => {
      const c = db.get();
      Promise.all([
        // Update theme resource
        c
          .findOneAndUpdate(
            {
              type: "Theme",
              "metadata.namespace": body.namespace,
              "metadata.name": `${body.namespace}-theme`,
            },
            {
              $set: {
                theme: body.theme,
                "metadata.updatedAt": new Date().toUTCString(),
              },
              $inc: {
                "metadata.revision": 1,
              },
            },
            {
              returnOriginal: false,
            }
          )
          .then((theme) => {
            if (theme) {
              return db.get().findOneAndUpdate(
                {
                  _id: theme._id,
                },
                {
                  $set: {
                    "metadata.last-applied-configuration": JSON.stringify(
                      theme
                    ),
                  },
                }
              );
            } else {
              failedAssociated({
                action: "read",
                resource: `Theme/${body.namespace}-theme`,
                namespace: body.namespace,
              });
            }
          })
          .catch((err) => {
            failedAssociated({
              action: "update",
              resource: "Theme",
              namespace: body.namespace,
            });
            logger.debug(err);
          }),
        // Update data for namespace
        c
          .findOneAndUpdate(
            {
              type: "Namespace",
              "metadata.name": body.namespace,
            },
            {
              $set: {
                "data.links": body.links,
                "data.title": body.title,
                "data.description": body.description,
                "metadata.updatedAt": new Date().toUTCString(),
              },
              $inc: {
                "metadata.revision": 1,
              },
            },
            {
              returnOriginal: false,
            }
          )
          .then((namespace) => {
            if (namespace) {
              return db.get().findOneAndUpdate(
                {
                  _id: namespace._id,
                },
                {
                  $set: {
                    "metadata.last-applied-configuration": JSON.stringify(
                      namespace
                    ),
                  },
                }
              );
            } else {
              failed({
                action: "read",
                resource: "Namespace",
                namespace: body.namespace,
              });
            }
          })
          .catch((err) => {
            failed({
              action: "update",
              resource: "Namespace",
              namespace: body.namespace,
            });
            logger.debug(err);
          }),
      ])
        .then(() => {
          response.status(200).json({ message: "Updated metadata" });
        })
        .catch(() => {
          response.status(500).json({ message: "Interal Server Error" });
        });
    }
  );

  /**
   * READ metadata information off of a namespace
   */
  router.get("/namespaces/:namespace/metadata", ({ params }, res) => {
    db.get()
      .findOne({ type: "Namespace", "metadata.name": params.namespace })
      .then((namespace) => {
        if (namespace) {
          res.status(200).json({
            links: {
              self: `${api.url}/namespaces/${params.namespace}/metadata`,
              namespace: `${api.url}/namespaces/${params.namespace}`,
            },
            ...namespace.data,
          });
        } else {
          logger.warn(`Could not find Namespace/${params.namespace}`);
          res.status(404).json({ message: "Not Found" });
        }
      })
      .catch((err) => {
        failed({
          action: "read",
          resource: "Namespace",
          namespace: params.namespace,
        });
        logger.debug(err);
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
