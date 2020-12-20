const cors = require("cors");
const express = require("express");
const fetch = require("node-fetch");
const endpoints = require("./endpoints");

const { db, logger } = require("./util");

var app = express();
const demoRouter = express.Router();

app.use(cors());

app.use(
  express.json({
    limit: "3mb",
  })
);

app.use("/api/v1/demo", demoRouter);

require("./lib/namespace")(demoRouter);
require("./lib/track")(demoRouter);
require("./lib/waveform")(demoRouter);
require("./lib/metadata")(demoRouter);

demoRouter.get("/", (_, response) => {
  response.redirect("/api/v1/demo/namespaces");
});

if (!process.env.TOKEN) {
  logger.error("No auth token provided as ENV variable");
  process.exit(1);
}

app.get("/", (_, response) => {
  response.redirect("/api");
});

app.get("/api", (_, response) => {
  response.json({
    app: "demo-man",
    svc: "api",
    version: process.env.VERSION,
  });
});

app.get("/api/ping", (_, response) => {
  response.send("pong.");
});

app.get("/api/healthz", (_, response) => {
  response.status(200).send("ok");
});

app.get("/api/test", (_, response) => {
  fetch(`${endpoints.waveman.url}/healthz`, { method: "GET" })
    .then((res) => {
      if (res.status == 200) {
        response.status(200).send("ok");
      } else {
        logger.error("Error establishing link to wave-man", {
          error: res.statusText,
        });
        response.status(res.status).send(res.statusText);
      }
    })
    .catch((err) => {
      logger.error("Error establishing link to wave-man", { error: err });
      response.status(500).send(err);
    });
});

db.connect(
  `${endpoints.mongo.url}/${endpoints.mongo.database}`,
  endpoints.mongo.database
)
  .then(() => {
    app.listen({ port: endpoints.api.port, host: "0.0.0.0" }, (err) => {
      if (err) {
        logger.error("Error occured on API server startup", { error: err });
      } else {
        logger.info("Started API server", {
          port: endpoints.api.port,
          time: new Date().toLocaleString("de-DE"),
        });
      }
    });
  })
  .catch((err) => {
    logger.error("MongoDB connector failed to connect to database", {
      error: err,
    });
    process.exit(1);
  });

module.exports = app;
