const { guard, waveform, db } = require("../../util/");
const { ObjectID } = require("mongodb");
const logger = require("@zoomoid/log").v2;
const { api, waveman } = require("../../endpoints");
const id = ObjectID.createFromHexString;

module.exports = function (router) {
  router
    .route("/track")
    /**
     * Add new track to API and queries wave-man for waveforms
     */
    .post(guard, ({ body }, res) => {
      const track = {
        ...body.track,
        _id: new ObjectID(),
        type: "Track",
      };
      waveform(track.namespace, track.filename, track._id, waveman.url);
      db.get()
        .insertOne(track)
        .then(() => {
          logger.info("Added track to namespace", {
            in: "POST /track",
            namespace: track.namespace,
          });
          res.status(200).json({
            message: "success",
          });
        })
        .catch((err) => {
          logger.error("Failed to create track resource", {
            in: "POST /track",
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
        .deleteMany({ path: req.body.path, type: "Track" })
        .then(() => {
          logger.info("Deleted track from namespace", {
            in: "DELETE /track",
            track: `${req.body.path}`,
          });
          res.status(200).json({
            message: "success",
          });
        })
        .catch((err) => {
          logger.error("Failed to delete track resource", {
            in: "DELETE /track",
            error: err,
          });
          res.status(500).json({ message: "Interal Server Error" });
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
            in: "GET /track",
            error: err,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    });

  /**
   * GET a specific track from the API
   */
  router.get("/track/:id", (req, res) => {
    db.get()
      .findOne({
        type: "Track",
        namespace: req.params.namespace,
        _id: id(req.params.id),
      })
      .then((resp) => {
        if (resp) {
          resp.waveform = `${api.url}/${req.params.namespace}/${resp._id}/waveform`;
          res.json(resp);
        } else {
          res.status(404).json({ message: "Not found" });
        }
      })
      .catch((err) => {
        logger.error("Failed to retrieve track resource", {
          in: "GET /track/:id",
          namespace: `${req.params.namespace}`,
          "track.id": `${req.params.id}`,
          error: err,
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
