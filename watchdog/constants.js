
/** API Server endpoint to query */
const apiEndpoint = process.env.API_ENDPOINT || "http://demo-api/api/v1/demo";

/** basic auth token that the watchdog has to append to a request to the API server */
const token = process.env.TOKEN;

/** basic volume cwd of the watchdog */
const volume = process.env.VOLUME || ".";

/** composite object to assemble the routes to the fileserver */
const url = JSON.parse(process.env.PUBLIC_PATH) || {
  prefix: "https",
  hostname: "demo.zoomoid.de",
  dir: "files/",
};

const metadataTemplate = (n) => `colors:
  accent: "#F58B44"
  primary: "#1A1A1A"
description: |
title: ${n}
links: []
`;


module.exports = {
  token,
  volume,
  url,
  apiEndpoint,
  metadataTemplate,
};