const { ObjectID } = require("mongodb");
const { guard, wavemanHook, db, logger } = require("../../util/");

const id = ObjectID.createFromHexString;

module.exports = function (router) {
  router
    .route("/tracks/:track/waveform")
    /**
     * GET a specific waveform for a specific track from the API server
     * :track is supposed to be a string of ObjectId of the track in question
     * :mode has to be either "full" or "small", otherway an error is returned
     * You can also send addition query "color" such that all templated colors get replaced with your color
     */
    .get((req, res) => {
      db.get()
        .findOne({
          type: "Waveform",
          track_id: id(req.params.track),
        })
        .then(
          (resp) => {
            if (resp) {
              switch (req.query.mode) {
                case "small":
                  return resp.small.replace(/\\/g, "");
                case "full":
                  return resp.full.replace(/\\/g, "");
                default:
                  res.status(405).json({ message: "Unsupported Mode" });
                  break;
              }
            } else {
              logger.warn("Could not find original document", {
                "track.id": req.params.track,
              });
            }
          },
          () => {
            res.status(404).json({ message: "Not Found" });
          }
        )
        .then((waveform) => {
          let color = req.query.color || "000000";
          return waveform.replace(/{{.color}}/g, `${color}`);
        })
        .then((waveform) => {
          if (req.query.aspectRatio) {
            return waveform.replace(
              "preserveAspectRatio=\"none\"",
              `preserveAspectRatio="${req.query.aspectRatio}"`
            );
          } else {
            return waveform;
          }
        })
        .then((waveform) => {
          res.set("Content-Type", "image/svg+xml").send(waveform);
        })
        .catch((err) => {
          logger.error("Failed to retrieve waveform resource", {
            in: "GET /tracks/:track/waveform/",
            namespace: `${req.params.namespace}`,
            "track.id": `${req.params.track}`,
            error: err,
          });
          if (!res.headersSent) {
            // we've not yet sent header information to indicate a client error
            res.status(500).json({ message: "Interal Server Error" });
          }
        });
    })
    /**
     * for a given track, regenerate waveforms by querying the wave-man again. This might be useful
     * if we change the config maps for the wave-man and do not want to remove the existing track to
     * retrigger the generation
     */
    .patch(guard, (req, res) => {
      db.get()
        .findOne(
          {
            _id: id(req.params.track),
            type: "Track",
          },
          { mp3: 1, name: 1 }
        )
        .then(({ mp3 }) => {
          if (mp3) {
            return wavemanHook(mp3);
          } else {
            logger.error("Could not find track document by id", {
              "track.id": req.params.track,
            });
            throw new Error("Not found");
          }
        })
        .then((svg) =>
          db.get().updateOne(
            {
              track_id: id(req.params.track),
              type: "Waveform",
            },
            { full: svg.full, small: svg.small }
          )
        )
        .then((resp) => {
          if (resp) {
            logger.info("Successfully redrawn waveform");
            res.status(200).json({
              message: "success",
            });
          } else {
            logger.warn(
              "Could not find waveform by id. Not updating waveform",
              {
                namespace: req.params.namespace,
                "track.id": req.params.track,
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

  router.route("/waveforms/by_namespace/:namespace").get((req, res) => {
    db.get()
      .find({
        type: "Waveform",
        namespace: req.body.namespace,
      })
      .toArray()
      .then((resp) => {
        res.json(resp);
      })
      .catch((err) => {
        logger.error("Failed to get waveforms by namespace", {
          namespace: req.params.namespace,
          error: err,
        });
      });
  });

  router.route("/waveforms/by_track/:id").get((req, res) => {
    db.get()
      .find({
        type: "Waveform",
        track_id: id(req.params.id),
      })
      .then((resp) => {
        res.json(resp);
      })
      .catch((err) => {
        logger.error("Failed to get waveforms by track", {
          track_id: req.params.id,
          error: err,
        });
      });
  });
};
