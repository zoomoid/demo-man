const { guard, waveform, db } = require("../../util/");
const { ObjectID } = require("mongodb");
const logger = require("@zoomoid/log");
const { api, waveman } = require("../../endpoints");

module.exports = function (router) {
  router
    .route("/track")
    /**
     * Add new track to API and queries wave-man for waveforms
     */
    .post(guard, async (req, res, next) => {
      // logger.info('Received POST request on /file route');
      try {
        const track = req.body.track;
        track.type = "Track";
        track._id = new ObjectID();
        waveform(track.namespace, track.filename, track._id, waveman.url);
        const resp = await db.get().insertOne(track);
        logger.info(
          "Added track to namespace",
          "level",
          "POST /track",
          "namespace",
          track.namespace
        );
        res.status(200).json({
          response: resp,
        });
      } catch (err) {
        logger.error(
          "Received error from MongoDB",
          "level",
          "POST /track",
          "response",
          err
        );
        next(err);
      }
    })
    /**
     * DELETE track from API
     */
    .delete(guard, async (req, res, next) => {
      try {
        const resp = await db
          .get()
          .deleteMany({ path: req.body.path, type: "Track" });
        logger.info(
          "Deleted track from namespace",
          "level",
          "DELETE /track",
          "track",
          `${req.body.path}`
        );
        res.status(200).json({
          response: resp,
        });
      } catch (err) {
        logger.error(
          "Received error from MongoDB",
          "level",
          "DELETE /track",
          "response",
          err
        );
        next(err);
      }
    });

  /**
   * GET a specific track from the API
   */
  router.get("/:namespace/:track", async (req, res, next) => {
    try {
      const resp = await db.get().findOne({
        type: "Track",
        namespace: req.params.namespace,
        _id: ObjectID.createFromHexString(req.params.track),
      });
      if (resp) {
        resp.waveform = `${api.url}/${req.params.namespace}/${resp._id}/waveform`;
        res.json(resp);
      } else {
        res.status(404).send("Not found");
      }
    } catch (err) {
      logger.error(
        "Error while loading track",
        "level",
        "GET /:namespace/:track",
        "namespace",
        `${req.params.namespace}`,
        "track.id",
        `${req.params.track}`,
        "error",
        err
      );
      next(err);
    }
  });
};
