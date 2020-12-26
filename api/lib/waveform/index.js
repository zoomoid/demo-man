const { ObjectID } = require("mongodb");
const { guard, wavemanHook, db, logger } = require("../../util/");
const { api, waveman } = require("../../endpoints");
const id = ObjectID.createFromHexString;

module.exports = function (router) {
  router
    .route("/tracks/:track/waveform")
    /**
     * for a given track, regenerate waveforms by querying the wave-man again. This might be useful
     * if we change the config maps for the wave-man and do not want to remove the existing track to
     * retrigger the generation
     */
    .patch(guard, ({params}, res) => {
      db.get()
        .findOne(
          {
            _id: id(params.track),
            type: "Track",
          },
        )
        .then((track) => {
          if (track) {
            const path = `${track.metadata.namespace}/${track.data.filename}`;
            return Promise.all([
              wavemanHook(waveman.url, path),
              Promise.resolve(track)
            ]);
          } else {
            logger.error(`Could not find Track/${params.track}`);
            throw new Error("Not found");
          }
        })
        .then((a) => ({
          svg: a[0],
          track: a[1]
        }))
        .then(({svg, track}) =>
          db.get().findOneAndUpdate(
            {
              type: "Waveform",
              "metadata.track_id": track._id,
              "metadata.name": track.metadata.name + "-waveform"
            },
            { 
              $set: {
                "metadata.updatedAt": new Date().toUTCString(),
                data: {
                  full: svg.full,
                  small: svg.small,
                } 
              },
              $inc: {
                "metadata.revision": 1
              }
            },
            {
              returnOriginal: false,
            }
          )
        )
        .then((waveform) => {
          return db.get().findOneAndUpdate({
            _id: waveform._id
          }, {
            $inc: {
              "metadata.last-applied-configuration": JSON.stringify(waveform),
            }
          });
        })
        .then((waveform) => {
          if (waveform) {
            logger.info("Successfully redrawn waveform");
            res.status(200).json({ message: "success" });
          } else {
            logger.error(
              "Could not find waveform. Not updating waveform",
              {
                namespace: params.namespace,
                "track.id": params.track,
              }
            );
          }
        })
        .catch((err) => {
          logger.error("Failed to redraw waveform resource", {
            error: err,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    });

  router.route("/waveforms/by_namespace/:namespace").get(({params}, res) => {
    db.get()
      .find({
        type: "Waveform",
        "metadata.namespace": params.namespace,
      })
      .toArray()
      .then((waveform) => {
        res.json({
          links: {
            self: `${api.url}/waveforms/by_namespace/${params.namespace}`,
            namespace: `${api.url}/namespaces/${params.namespace}`,
          },
          waveforms: waveform.map((waveform) => ({
            links: {
              full: `${api.url}/waveforms/by_track/${waveform.track_id}/full`,
              small: `${api.url}/waveforms/by_track/${waveform.track_id}/small`,
            },
            ...waveform,
          })),
        });
      })
      .catch((err) => {
        logger.error("Failed to get waveforms by namespace", {
          namespace: params.namespace,
          error: err,
        });
      });
  });

  /**
   * READ a specific waveform for a specific track from the API server
   * :track is supposed to be a string of ObjectId of the track in question
   * :mode has to be either "full" or "small", otherway an error is returned
   * You can also send addition query "color" such that all templated colors get replaced with your color
   */
  router.route("/waveforms/by_track/:track_id/:mode").get(({params, query}, res) => {
    db.get()
      .findOne({
        type: "Waveform",
        "metadata.track_id": id(params.track_id),
      })
      .then(
        (waveform) => {
          if (waveform) {
            switch (params.mode) {
              case "small":
                return waveform.small.replace(/\\/g, "");
              case "full":
                return waveform.full.replace(/\\/g, "");
              default:
                res.status(405).json({ message: "Unsupported Mode" });
                break;
            }
          } else {
            logger.warn("Could not find waveform", {
              "track.id": params.track_id,
            });
            res.status(404).json({ message: "Not Found" });
          }
        },
      )
      .then((waveform) => {
        let color = query.color || "000000";
        return waveform.replace(/{{.color}}/g, `${color}`);
      })
      .then((waveform) => {
        if (query.aspectRatio) {
          return waveform.replace(
            "preserveAspectRatio=\"none\"",
            `preserveAspectRatio="${query.aspectRatio}"`
          );
        } else {
          return waveform;
        }
      })
      .then((waveform) => {
        res.set("Content-Type", "image/svg+xml").send(waveform);
      })
      .catch((err) => {
        logger.error("Failed to get waveform resource", {
          namespace: `${params.namespace}`,
          "track.id": `${params.track_id}`,
          error: err,
        });
        if (!res.headersSent) {
          // we've not yet sent header information to indicate a client error
          res.status(500).json({ message: "Interal Server Error" });
        }
      });
  });

  /**
   * READ waveforms by track_id
   */
  router.route("/waveforms/by_track/:track_id").get(({ params }, res) => {
    db.get()
      .findOne({
        type: "Waveform",
        "metadata.track_id": id(params.track_id),
      })
      .then((waveform) => {
        res.json({
          links: {
            self: `${api.url}/waveforms/by_track/${params.track_id}`,
            track: `${api.url}/tracks/${params.track_id}`,
            full: `${api.url}/waveforms/by_track/${params.track_id}/full`,
            small: `${api.url}/waveforms/by_track/${params.track_id}/small`,
          },
          ...waveform,
        });
      })
      .catch((err) => {
        logger.error("Failed to get waveforms by track", {
          in: "GET /waveforms/by_track/:track",
          track_id: params.track_id,
          error: err,
        });
      });
  });
};
