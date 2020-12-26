const {
  guard,
  db,
  logger,
  dnsName,
  pluralize,
  failed,
  failedAssociated,
} = require("../../util/");
const { api } = require("../../endpoints");

module.exports = function (router) {
  router
    .route("/namespaces")
    /**
     * ADD new album to API
     */
    .post(guard, (req, res) => {
      const n = dnsName(req.body.namespace);
      const namespace = {
        type: "Namespace",
        metadata: {
          name: n,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          revision: 0,
        },
        data: {},
      };
      const theme = {
        type: "Theme",
        metadata: {
          name: `${n}-theme`,
          namespace: n,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
          revision: 0, // as we start with an empty theme, we want to start revisions at 0
        },
        data: {
          theme: {},
          computedTheme: {},
        },
      };
      Promise.all([
        db
          .get()
          .insertOne(theme)
          .then((theme) => {
            return db.get().findOneAndUpdate(
              {
                _id: theme._id,
              },
              {
                $set: {
                  "metadata.last-applied-configuration": JSON.stringify(theme),
                },
              }
            );
          })
          .then(() => {
            logger.verbose(`Added Theme/${theme.metadata.name}`);
          })
          .catch((err) => {
            failedAssociated({
              action: "create",
              resource: "Theme",
              namespace: n,
            });
            logger.debug(err);
            throw err;
          }),
        db
          .get()
          .insertOne(namespace)
          .then((namespace) => {
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
          })
          .then(() => {
            logger.verbose(`Created Namespace/${namespace.metadata.name}`);
          })
          .catch((err) => {
            failed({ action: "create", resource: "Namespace", namespace: n });
            logger.debug(err);
            throw err;
          }),
      ])
        .then(() => {
          res.status(200).json({
            message: "success",
          });
        })
        .catch(() => {
          res.status(500).json({ message: "Interal Server Error" });
        });
    })
    /**
     * DELETE album from API
     */
    .delete(guard, ({ body }, res) => {
      const namespace = body.namespace;
      const c = db.get();
      Promise.all([
        c
          .deleteMany({ type: "Track", "metadata.namespace": namespace })
          .then(({ deletedCount }) => {
            logger.verbose(
              `Deleted ${pluralize(
                "Track",
                deletedCount
              )} in Namespace/${namespace}`
            );
          })
          .catch((err) => {
            failedAssociated({
              action: "delete",
              resource: "Track",
              namespace,
            });
            logger.debug(err);
            throw err;
          }),
        c
          .deleteMany({ type: "Waveform", "metadata.namespace": namespace })
          .then(({ deletedCount }) => {
            logger.verbose(
              `Deleted ${pluralize(
                "Waveform",
                deletedCount
              )} in Namespace/${namespace}`
            );
          })
          .catch((err) => {
            failedAssociated({
              action: "delete",
              resource: "Waveform",
              namespace,
            });
            logger.debug(err);
            throw err;
          }),
        c
          .deleteMany({ type: "Theme", "metadata.namespace": namespace })
          .then(({ deletedCount }) => {
            logger.verbose(
              `Deleted ${pluralize(
                "Theme",
                deletedCount
              )} in Namespace/${namespace}`
            );
          })
          .catch((err) => {
            failedAssociated({
              action: "delete",
              resource: "Theme",
              namespace,
            });
            logger.debug(err);
            throw err;
          }),
        c
          .deleteMany({ type: "Namespace", "metadata.name": namespace })
          .then(({ deletedCount }) => {
            if (deletedCount > 0) {
              logger.verbose(`Deleted Namespace/${namespace}`);
            } else {
              logger.verbose(`Not deleted Namespace/${namespace}`);
            }
          })
          .catch((err) => {
            failed({ action: "delete", resource: "Namespace", namespace });
            logger.debug(err);
            throw err;
          }),
      ])
        .then(() => {
          res.status(200).json({ message: "success" });
        })
        .catch(() => {
          res.status(500).json({ message: "Interal Server Error" });
        });
    })
    /**
     * READ all namespaces from API
     */
    .get((_, res) => {
      db.get()
        .find({ type: "Namespace" })
        .toArray()
        .then((namespaces) =>
          namespaces.map((namespace) => {
            return {
              links: {
                self: `${api.url}/namespaces/${namespace.metadata.name}`,
                theme: `${api.url}/namespaces/${namespace.metadata.name}/theme`,
                cover: `${api.url}/namespaces/${namespace.metadata.name}/cover`,
                tracks: `${api.url}/namespaces/${namespace.metadata.name}/tracks`,
                metadata: `${api.url}/namespaces/${namespace.metadata.name}/metadata`,
                waveforms: `${api.url}/waveforms/by_namespace/${namespace.metadata.name}`,
              },
              ...namespace,
            };
          })
        )
        .then((namespaces) => {
          if (namespaces) {
            res.status(200).json({
              namespaces,
            });
          } else {
            res.status(404).json({ message: "Not Found" });
          }
        })
        .catch((err) => {
          failed({
            action: "read",
            resource: "Namespace",
            namespace: "*",
          });
          logger.debug(err);
          res.status(500).json({ message: "Interal Server Error" });
        });
    });

  /**
   * READ specific namespace from API
   */
  router.get("/namespaces/:namespace", ({ params }, res) => {
    db.get()
      .findOne({ type: "Namespace", "metadata.name": params.namespace })
      .then((namespace) => {
        if (namespace) {
          res.status(200).json({
            links: {
              self: `${api.url}/namespaces/${params.namespace}/`,
              cover: `${api.url}/namespaces/${params.namespace}/cover`,
              theme: `${api.url}/namespaces/${params.namespace}/theme`,
              tracks: `${api.url}/namespaces/${params.namespace}/tracks`,
              metadata: `${api.url}/namespaces/${params.namespace}/metadata`,
              waveforms: `${api.url}/waveforms/by_namespace/${params.namespace}`,
            },
            ...namespace,
          });
        } else {
          logger.warn(`Could not find Namespace/${params.namespace}`);
          res.status(404).json({ message: "Not found" });
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

  /**
   * READ all tracks from the API for a certain namespace from the API
   */
  router.get("/namespaces/:namespace/tracks", ({ params }, res) => {
    db.get()
      .find({ type: "Track", "metadata.namespace": params.namespace })
      .toArray()
      .then((tracks) =>
        tracks.map((track) => {
          return {
            links: {
              self: `${api.url}/tracks/${track._id}/`,
              namespace: `${api.url}/namespaces/${track.metadata.namespace}`,
              waveform: `${api.url}/waveforms/by_track/${track._id}`,
              cover: `${api.url}/namespaces/${track.metadata.namespace}/cover`,
            },
            ...track,
          };
        })
      )
      .then((tracks) => {
        if (tracks) {
          res.status(200).json({
            links: {
              self: `${api.url}/namespaces/${params.namespace}/tracks`,
              namespace: `${api.url}/namespaces/${params.namespace}`,
            },
            tracks,
          });
        } else {
          logger.warn(`Could not find Tracks in Namespace/${params.namespace}`);
          res.status(404).json({ message: "Not found" });
        }
      })
      .catch((err) => {
        failedAssociated({
          action: "read",
          resource: "Tracks",
          namespace: params.namespace,
        });
        logger.debug(err);
        res.status(500).json({ message: "Interal Server Error" });
      });
  });

  /**
   * GET the cover of a specified namespace from the API
   */
  router.get("/namespaces/:namespace/cover", ({ params }, res) => {
    db.get()
      .findOne({ type: "Track", "metadata.namespace": params.namespace })
      .then((track) => {
        if (track && track.data?.cover?.publicUrl) {
          res.redirect(track.data.cover.publicUrl);
        } else {
          logger.warn(`Could not find cover in Namespace/${params.namespace}`);
          res.status(404).json({ message: "Not found" });
        }
      })
      .catch((err) => {
        logger.error(
          `Could not create redirection to cover for Namespace/${params.namespace}`
        );
        logger.debug(err);
        res.status(500).json({ message: "Interal Server Error" });
      });
  });

  /**
   * Redirect to Waveform by Namespace route
   */
  router.get("/namespaces/:namespace/waveforms", ({ params }, res) => {
    res.redirect(`${api.url}/waveforms/by_namespace/${params.namespace}`);
  });
};
