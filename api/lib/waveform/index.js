const { ObjectID } = require("mongodb");
const logger = require("@zoomoid/log");
const { guard, wavemanHook, db } = require("../../util/");

module.exports = function (router) {
  router
    .route("/:namespace/:track/waveform")
    /**
     * GET a specific waveform for a specific track from the API server
     * :track is supposed to be a string of ObjectId of the track in question
     * :mode has to be either "full" or "small", otherway an error is returned
     * You can also send addition query "color" such that all templated colors get replaced with your color
     */
    .get(async (req, res, next) => {
      try {
        const resp = await db.get().findOne({
          type: "Waveform",
          track_id: ObjectID.createFromHexString(req.params.track),
          namespace: req.params.namespace,
        });
        if (resp) {
          let waveform;
          switch (req.query.mode) {
            case "small":
              waveform = resp.small.replace(/\\/g, "");
              break;
            case "full":
              waveform = resp.full.replace(/\\/g, "");
              break;
            default:
              res.status(405).send("Unsupported mode");
              return;
          }
          let color = "F58B44";
          if (req.query.color) {
            color = req.query.color;
          }
          waveform = waveform.replace(/{{.color}}/g, `#${color}`);
          res.set({
            "Content-Type": "image/svg+xml",
          });
          res.send(waveform);
        } else {
          res.status(404).send("Not found");
        }
      } catch (err) {
        logger.error(
          "Error while loading waveform",
          "level",
          "GET /namespace:/:track/waveform/:mode",
          "namespace",
          `${req.params.namespace}`,
          "track.id",
          `${req.params.track}`,
          "error",
          err
        );
        next(err);
      }
    })
    /**
     * for a given track, regenerate waveforms by querying the wave-man again. This might be useful
     * if we change the config maps for the wave-man and do not want to remove the existing track to
     * retrigger the generation
     */
    .patch(guard, async (req, res, next) => {
      try {
        // Fetch track url from database
        const { url, name } = await db.get().findOne(
          {
            _id: ObjectID.createFromHexString(req.params.track),
            type: "Track",
          },
          { mp3: 1, name: 1 }
        );
        const svg = await wavemanHook(url);
        const resp = await db.get().updateOne(
          {
            track_id: ObjectID.createFromHexString(req.params.track),
            type: "Waveform",
          },
          { full: svg.full, small: svg.small }
        );
        logger.info("Successfully updated waveform", "updated", `${name}`);
        res.status(200).json({
          response: resp,
        });
      } catch (err) {
        console.error(err);
        logger.error(
          "Received error along the way of retriggering waveform generation",
          "response",
          err
        );
        next(err);
      }
    });
};
