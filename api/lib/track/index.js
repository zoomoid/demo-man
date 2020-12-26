const {
  guard,
  waveform,
  palette,
  db,
  logger,
  dnsName,
  pluralize,
  failed,
  failedAssociated,
} = require("../../util/");
const { ObjectID } = require("mongodb");
const { api, waveman, picasso } = require("../../endpoints");
const id = ObjectID.createFromHexString;

/**
 * Dispatches a set of promises
 * @param {Array<Promise>} fn_array array of Promise functions
 */
const dispatch = (fn_array) => {
  return Promise.all(fn_array);
};

module.exports = function (router) {
  router
    .route("/tracks")
    /**
     * Add new track to API and queries wave-man for waveforms
     */
    .post(guard, ({ body }, res) => {
      const track = {
        _id: new ObjectID(),
        type: "Track",
        metadata: {
          namespace: dnsName(body.metadata.namespace),
          name: dnsName(body.metadata.name),
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
        },
        data: {
          ...body.track,
        },
      };
      dispatch([
        waveform(track, waveman.url).catch((err) => {
          logger.error("Failed to complete waveform hook", {
            message: err.message,
          });
        }),
        palette(track, picasso.url).catch((err) => {
          logger.error("Failed to complete picasso hook", {
            message: err.message,
          });
        }),
      ]);
      db.get()
        .insertOne(track)
        .then((track) => {
          return db.get().findOneAndUpdate(
            {
              _id: track._id,
            },
            {
              $set: {
                "metadata.last-applied-configuration": JSON.stringify(track),
              },
            }
          );
        })
        .then(() => {
          logger.info(`Created Track/${track.metadata.name}`, {
            namespace: track.namespace,
          });
          res.status(200).json({
            message: "success",
          });
        })
        .catch(() => {
          failed({
            action: "create",
            resource: "Track",
            namespace: track.metadata.namespace,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    })
    /**
     * DELETE track from API
     */
    .delete(guard, ({ body }, res) => {
      db.get()
        .findOne({ path: body.path, type: "Track" })
        .then((track) => {
          if (track) {
            const namespace = track.metadata.namespace;
            const c = db.get();
            Promise.all([
              c
                .deleteMany({ Type: "Track", "track.file.path": body.path })
                .then(({ deletedCount }) => {
                  logger.verbose(
                    `Deleted ${pluralize(
                      "Track",
                      deletedCount
                    )} in Namespace/${namespace}`
                  );
                })
                .catch((err) => {
                  failed({
                    action: "delete",
                    resource: "Track",
                    namespace: namespace,
                  });
                  throw err;
                }),
              c
                .deleteMany({ type: "Waveform", track_id: track._id })
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
          } else {
            logger.error("Could not find Track", {
              path: body.path,
            });
            res.status(404).json({ message: "Not found" });
          }
        });
    })
    .get((_, res) => {
      db.get()
        .find({ type: "Track" })
        .toArray()
        .then((tracks) => {
          if (tracks) {
            res.status(200).json({
              links: {
                self: `${api.url}/tracks`,
              },
              tracks: tracks.map((track) => ({
                links: {
                  self: `${api.url}/tracks/${track._id}`,
                  waveform: `${api.url}/waveforms/by_track/${track._id}`,
                  namespace: `${api.url}/namespaces/${track.metadata.namespace}`,
                  cover: `${api.url}/namespaces/${track.metadata.namespace}/cover`,
                },
                ...track,
              })),
            });
          } else {
            // Fully valid case for empty database, no further logging
            res.status(404).json({ message: "Not Found" });
          }
        })
        .catch((err) => {
          logger.error("Failed to get track resources", {
            error: err,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    });

  /**
   * GET a specific track from the API
   */
  router.get("/tracks/:id", (req, res) => {
    db.get()
      .findOne({
        type: "Track",
        _id: id(req.params.id),
      })
      .then((track) => {
        if (track) {
          res.json({
            links: {
              self: `${api.url}/tracks/${track._id}`,
              waveform: `${api.url}/waveforms/by_track/${track._id}`,
              namespace: `${api.url}/namespaces/${track.metadata.namespace}`,
              cover: `${api.url}/namespaces/${track.metadata.namespace}/cover`,
            },
            ...track,
          });
        } else {
          res.status(404).json({ message: "Not found" });
        }
      })
      .catch((err) => {
        logger.error("Failed to get track resource", {
          "track.id": `${req.params.id}`,
          error: err,
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
