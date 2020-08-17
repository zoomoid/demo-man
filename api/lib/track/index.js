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
    .post(guard, async (req, res) => {
      const track = {
        _id: new ObjectID(),
        type: "Track",
        ...req.body.track,
      };
      waveform(track.namespace, track.filename, track._id, waveman.url);
      db.get()
        .insertOne(track)
        .then((resp) => {
          logger.info("Added track to namespace", {
            in: "POST /track",
            namespace: track.namespace,
          });
          res.status(200).json({
            response: resp,
          });
        })
        .catch((err) => {
          logger.error("Received error from MongoDB", {
            in: "POST /track",
            error: err,
          });
          res.status(500).send("Internal Server Error");
        });
    })
    /**
     * DELETE track from API
     */
    .delete(guard, async (req, res) => {
      db.get()
        .deleteMany({ path: req.body.path, type: "Track" })
        .then((resp) => {
          logger.info("Deleted track from namespace", {
            in: "DELETE /track",
            track: `${req.body.path}`,
          });
          res.status(200).json({
            response: resp,
          });
        })
        .catch((err) => {
          logger.error("Received error from MongoDB", {
            in: "DELETE /track",
            error: err,
          });
          res.status(500).send("Internal Server Error");
        });
    });

  /**
   * GET a specific track from the API
   */
  router.get("/:namespace/:track", async (req, res) => {
    db.get()
      .findOne({
        type: "Track",
        namespace: req.params.namespace,
        _id: id(req.params.track),
      })
      .then((resp) => {
        if (resp) {
          resp.waveform = `${api.url}/${req.params.namespace}/${resp._id}/waveform`;
          res.json(resp);
        } else {
          logger.warn("Could not find original document", {
            namespace: req.param.namespace,
            "track.id": req.params.track,
          });
          res.status(404).send("Not found");
        }
      })
      .catch((err) => {
        logger.error("Error while loading track", {
          in: "GET /:namespace/:track",
          namespace: `${req.params.namespace}`,
          "track.id": `${req.params.track}`,
          error: err,
        });
        res.status(500).send("Internal Server Error");
      });
  });
};
