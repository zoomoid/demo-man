const { guard, db } = require("../../util/");
const logger = require("@zoomoid/log").v2;
const { api } = require("../../endpoints");

module.exports = function (router) {
  router
    .route("/namespace")
    /**
     * ADD new album to API
     */
    .post(guard, (req, res) => {
      const namespace = {
        type: "Namespace",
        name: req.body.namespace,
      };
      db.get()
        .insertOne(namespace)
        .then((resp) => {
          logger.info("Added new namespace", {
            in: "POST /namespace",
            namespace: namespace.name,
          });
          res.status(200).json({
            response: resp,
          });
        })
        .catch((err) => {
          logger.error("Received error from MongoDB", {
            in: "POST /namespace",
            error: err,
          });
          res.status(500).send("Internal Server Error");
        });
    })
    /**
     * DELETE album from API
     */
    .delete(guard, (req, res) => {
      const path = req.body.namespace;
      const c = db.get();
      const resp = Promise.all([
        c.deleteMany({ type: "Track", namespace: path }),
        c.deleteMany({ type: "Namespace", name: path }),
        c.deleteMany({ type: "Waveform", namespace: path }),
      ])
        .then(() => {
          logger.info("Deleted album", {
            in: "DELETE /namespace",
            namespace: `${req.body.namespace}`,
          });
          res.status(200).json({
            response: resp,
          });
        })
        .catch((err) => {
          logger.error("Received error from MongoDB", {
            in: "DELETE /namespace",
            error: err,
          });
          res.status(500).send("Internal Server Error");
        });
    });

  /**
   * GET all namespaces/albums
   */
  router.get("/", (req, res) => {
    db.get()
      .find({ type: "Namespace" })
      .then((resp) => resp.toArray())
      .then((resp) =>
        resp.map((e) => {
          return {
            url: `${api.url}/${e.name}`,
            ...e,
          };
        })
      )
      .then((resp) => {
        res.status(200).json({
          data: resp,
        });
      })
      .catch((err) => {
        logger.error("Received error from MongoDB", {
          in: "GET /",
          error: err,
        });
        res.status(500).send("Internal Server Error");
      });
  });

  /**
   * GET all tracks from the API for a certain namespace from the API
   */
  router.get("/:namespace", async (req, res) => {
    db.get()
      .find({ type: "Track", namespace: req.params.namespace })
      .then((resp) => resp.toArray())
      .then((resp) =>
        resp.map((t) => {
          return {
            url: `${api.url}/${req.params.namespace}/${t._id}/`,
            waveform: `${api.url}/${req.params.namespace}/${t._id}/waveform`,
            ...t
          };
        })
      )
      .then((resp) => {
        res.status(200).json({
          data: resp,
        });
      })
      .catch((err) => {
        logger.error("Received error from MongoDB", {
          in: "GET /:namespace",
          error: err,
        });
        res.status(500).send("Internal Server Error");
      });
  });

  /**
   * GET the cover of a specified namespace/album
   */
  router.get("/:namespace/cover", async (req, res) => {
    db.get()
      .findOne({ type: "Track", namespace: req.params.namespace })
      .then((resp) => {
        res.redirect(resp.cover.public_url);
      })
      .catch((err) => {
        logger.error("Error while redirecting to cover", {
          in: "GET /:namespace/cover",
          namespace: `${req.params.namespace}`,
          error: err,
        });
        res.status(500).send("Internal Server Error");
      });
  });

  router.route("/:namespace/waveform").get((req, res) => {
    db.get()
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
      .then((resp) => resp.toArray())
      .then((resp) =>
        resp.map((waveform) => {
          switch (req.query.mode) {
            case "small":
              return { waveform: waveform.small };
            case "full":
              return { waveform: waveform.full };
            default:
              return {
                waveform: { full: waveform.full, small: waveform.small },
              };
          }
        })
      )
      .then((resp) => {
        res.json({ data: resp });
      })
      .catch((err) => {
        logger.error("Error while loading waveforms", {
          in: "GET /:namespace/waveform",
          namespace: `${req.params.namespace}`,
          error: err,
        });
        res.status(500).send("Internal Server Error");
      });
  });
};
