const { guard, db } = require("../../util/");
const logger = require("@zoomoid/log");
const { api } = require("../../endpoints");

module.exports = function (router) {
  router
    .route("/namespace")
    /**
     * ADD new album to API
     */
    .post(guard, async (req, res, next) => {
      try {
        const namespace = {
          type: "Namespace",
          name: req.body.namespace,
        };
        const resp = await db.get().insertOne(namespace);
        logger.info(
          "Added new namespace",
          "level",
          "POST /namespace",
          "namespace",
          namespace.name
        );
        res.status(200).json({
          response: resp,
        });
      } catch (err) {
        logger.error(
          "Received error from MongoDB",
          "level",
          "POST /namespace",
          "response",
          err
        );
        next(err);
      }
    })
    /**
     * DELETE album from API
     */
    .delete(guard, async (req, res, next) => {
      try {
        const path = req.body.namespace;
        const c = db.get();
        const resp = await Promise.all([
          c.deleteMany({ type: "Track", namespace: path }),
          c.deleteMany({ type: "Namespace", name: path }),
          c.deleteMany({ type: "Waveform", namespace: path }),
        ]);
        logger.info(
          "Deleted album",
          "level",
          "DELETE /namespace",
          "namespace",
          `${req.body.namespace}`
        );
        res.status(200).json({
          response: resp,
        });
      } catch (err) {
        logger.error(
          "Received error from MongoDB",
          "level",
          "DELETE /namespace",
          "response",
          err
        );
        next(err);
      }
    });

  /**
   * GET all namespaces/albums
   */
  router.get("/", async (req, res, next) => {
    try {
      let resp = await db.get().find({ type: "Namespace" }).toArray();
      resp = resp.map((e) => {
        e.url = `${api.url}/${e.name}`;
        return e;
      });
      res.status(200).json({
        data: resp,
      });
    } catch (err) {
      logger.error(
        "Received error from MongoDB",
        "level",
        "GET /",
        "response",
        err
      );
      next(err);
    }
  });

  /**
   * GET all tracks from the API for a certain namespace from the API
   */
  router.get("/:namespace", async (req, res, next) => {
    try {
      let resp = await db
        .get()
        .find({ type: "Track", namespace: req.params.namespace })
        .toArray();
      resp = resp.map((t) => {
        t.url = `${api.url}/${req.params.namespace}/${t._id}/`;
        t.waveform = `${api.url}/${req.params.namespace}/${t._id}/waveform`;
        return t;
      });
      res.status(200).json({
        data: resp,
      });
    } catch (err) {
      logger.error(
        "Received error from MongoDB",
        "level",
        "GET /:namespace",
        "response",
        err
      );
      next(err);
    }
  });

  /**
   * GET the cover of a specified namespace/album
   */
  router.get("/:namespace/cover", async (req, res, next) => {
    try {
      let resp = await db
        .get()
        .findOne({ type: "Track", namespace: req.params.namespace });
      res.redirect(resp.cover.public_url);
    } catch (err) {
      logger.error(
        "Error while redirecting to cover",
        "level",
        "GET /:namespace/cover",
        "namespace",
        `${req.params.namespace}`,
        "error",
        err
      );
      next(err);
    }
  });

  router.route("/:namespace/waveform").get(async (req, res, next) => {
    try {
      let resp = await db
        .get()
        .aggregate([
          { $match: { type: "Waveform", namespace: req.params.namespace } },
          {
            $lookup: {
              from: "demo",
              localField: "track_id",
              foreignField: "_id",
              as: "track",
            },
          },
        ])
        .toArray();
      resp = resp.map((waveform) => {
        switch (req.query.mode) {
          case "small":
            return { waveform: waveform.small };
          case "full":
            return { waveform: waveform.full };
          default:
            return { waveform: { full: waveform.full, small: waveform.small } };
        }
      });
      res.json({ data: resp });
    } catch (err) {
      logger.error(
        "Error while loading waveforms",
        "level",
        "GET /:namespace/waveform",
        "namespace",
        `${req.params.namespace}`,
        "error",
        err
      );
      next(err);
    }
  });
};
