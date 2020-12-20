const { guard, waveform, palette, db, logger } = require("../../util/");
const { ObjectID } = require("mongodb");
const { api, waveman, picasso } = require("../../endpoints");
const id = ObjectID.createFromHexString;

module.exports = function (router) {
  router
    .route("/tracks")
    /**
     * Add new track to API and queries wave-man for waveforms
     */
    .post(guard, ({ body }, res) => {
      const track = {
        ...body.track,
        _id: new ObjectID(),
        type: "Track",
      };
      // Dispatch waveform creation
      waveform(track.namespace, track.filename, track._id, waveman.url);
      if (track.cover && track.cover.localUrl) {
        // Dispatch computed theme creation only if cover is present
        palette(track.namespace, track.cover.localUrl, track._id, picasso.url);
      }
      // Insert entry into DB
      db.get()
        .insertOne(track)
        .then(() => {
          logger.info("Added track to namespace", {
            in: "POST /tracks",
            namespace: track.namespace,
          });
          res.status(200).json({
            message: "success",
          });
        })
        .catch((err) => {
          logger.error("Failed to create track resource", {
            in: "POST /tracks",
            error: err,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    })
    /**
     * DELETE track from API
     */
    .delete(guard, (req, res) => {
      db.get()
        .findOne({ path: req.body.path, type: "Track" })
        .then((resp) => {
          if (resp) {
            db.get()
              .deleteMany({
                $or: [
                  { path: req.body.path, type: "Track" },
                  { type: "Waveform", track_id: resp._id },
                ],
              })
              .then(() => {
                logger.info("Deleted track and waveform from namespace", {
                  in: "DELETE /tracks",
                  track: `${resp.title}`,
                });
                res.status(200).json({
                  message: "success",
                });
              })
              .catch((err) => {
                logger.error("Failed to delete track resource", {
                  in: "DELETE /tracks",
                  error: err,
                });
                res.status(500).json({ message: "Interal Server Error" });
              });
          }
        });
    })
    .get((req, res) => {
      db.get()
        .find({ type: "Track" })
        .toArray()
        .then((resp) => {
          if (resp) {
            res.status(200).json({ tracks: resp });
          } else {
            res.status(404).json({ message: "Not Found" });
          }
        })
        .catch((err) => {
          logger.error("Failed to retrieve track resources", {
            in: "GET /tracks",
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
      .then((resp) => {
        if (resp) {
          resp.waveform = `${api.url}/waveforms/by_track/${resp._id}`;
          res.json(resp);
        } else {
          res.status(404).json({ message: "Not found" });
        }
      })
      .catch((err) => {
        logger.error("Failed to retrieve track resource", {
          in: "GET /tracks/:id",
          "track.id": `${req.params.id}`,
          error: err,
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
