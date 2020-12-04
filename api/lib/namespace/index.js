const { guard, db } = require("../../util/");
const logger = require("@occloxium/log").v2;
const { api } = require("../../endpoints");

module.exports = function (router) {
  router
    .route("/namespaces")
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
        .then(() => {
          logger.info("Added new namespace", {
            in: "POST /namespace",
            namespace: namespace.name,
          });
          res.status(200).json({
            message: "success",
          });
        })
        .catch((err) => {
          logger.error("Failed to create namespace resource", {
            in: "POST /namespace",
            error: err,
            namespace: `${req.body.namespace}`,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    })
    /**
     * DELETE album from API
     */
    .delete(guard, (req, res) => {
      const path = req.body.namespace;
      const c = db.get();
      Promise.all([
        c.deleteMany({ type: "Track", namespace: path }),
        c.deleteMany({ type: "Namespace", name: path }),
        c.deleteMany({ type: "Waveform", namespace: path }),
      ])
        .then(() => {
          logger.info("Deleted album", {
            in: "DELETE /namespaces",
            namespace: `${req.body.namespace}`,
          });
          res.status(200).json({
            message: "success",
          });
        })
        .catch((err) => {
          logger.error("Failed to delete namespace resources", {
            in: "DELETE /namespaces",
            namespace: `${req.body.namespace}`,
            error: err,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    })
    .get((req, res) => {
      db.get()
        .find(
          { type: "Namespace" },
          { projection: { metadata: 0, lastUpdated: 0 } }
        )
        .toArray()
        .then((resp) =>
          resp.map((e) => {
            return {
              url: `${api.url}/namespaces/${e.name}`,
              ...e,
            };
          })
        )
        .then((resp) => {
          if (resp) {
            res.status(200).json({
              namespaces: resp,
            });
          } else {
            res.status(404).json({ message: "Not Found" });
          }
        })
        .catch((err) => {
          logger.error("Failed to retrieve namespace resources", {
            in: "GET /namespaces",
            namespace: `${req.params.namespace}`,
            error: err,
          });
          res.status(500).json({ message: "Interal Server Error" });
        });
    });

  /**
   * GET all tracks from the API for a certain namespace from the API
   */
  router.get("/namespaces/:namespace/tracks", (req, res) => {
    db.get()
      .find({ type: "Track", namespace: req.params.namespace })
      .toArray()
      .then((resp) =>
        resp.map((t) => {
          return {
            url: `${api.url}/tracks/${t._id}/`,
            waveform: `${api.url}/tracks/${t._id}/waveform`,
            ...t,
          };
        })
      )
      .then((resp) => {
        res.status(200).json({
          tracks: resp,
        });
      })
      .catch((err) => {
        logger.error("Failed to retrieve tracks of namespace resource", {
          in: "GET /namespaces/:namespace/tracks",
          namespace: `${req.params.namespace}`,
          error: err,
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });

  router.get("/namespaces/:namespace", (req, res) => {
    Promise.all([
      db.get().findOne({ type: "Namespace", name: req.params.namespace }),
      db
        .get()
        .find({ type: "Track", namespace: req.params.namespace })
        .toArray()
        .then((resp) =>
          resp.map((t) => {
            return {
              url: `${api.url}/track/${t._id}/`,
              waveform: `${api.url}/track/${t._id}/waveform`,
              ...t,
            };
          })
        ),
    ])
      .then((resp) => ({
        namespace: resp[0],
        tracks: resp[1],
      }))
      .then(({ namespace, tracks }) => {
        if (namespace) {
          res.status(200).json({
            ...namespace,
            tracks: tracks,
          });
        } else {
          logger.warn("Could not find namespace resource", {
            namespace: req.param.namespace,
          });
          res.status(404).json({ message: "Not found" });
          return {};
        }
      })
      .catch((err) => {
        logger.error("Failed to retrieve namespace resource", {
          in: "GET /namespaces/:namespace",
          namespace: `${req.params.namespace}`,
          error: err,
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });

  /**
   * GET the cover of a specified namespace/album
   */
  router.get("/namespaces/:namespace/cover", (req, res) => {
    db.get()
      .findOne({ type: "Track", namespace: req.params.namespace })
      .then((resp) => {
        res.redirect(resp.cover.public_url);
      })
      .catch((err) => {
        logger.error("Failed to redirect to cover of namespace resource", {
          in: "GET /namespaces/:namespace/cover",
          namespace: `${req.params.namespace}`,
          error: err,
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });

  router.route("/namespaces/:namespace/waveforms").get((req, res) => {
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
      .toArray()
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
                url: `${api.url}/tracks/${waveform.track[0]._id}/waveform`,
              };
          }
        })
      )
      .then((resp) => {
        res.json({ waveforms: resp });
      })
      .catch((err) => {
        logger.error("Failed to retrieve waveforms of namespace resource", {
          in: "GET /namespaces/:namespace/waveforms",
          namespace: `${req.params.namespace}`,
          error: err,
        });
        res.status(500).json({ message: "Interal Server Error" });
      });
  });
};
