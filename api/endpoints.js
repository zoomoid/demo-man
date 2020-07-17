const endpoints = {
  mongo: {
    url: process.env.MONGOURL || "mongodb://demo-mongodb:27017",
    database: process.env.DB || "demo",
  },
  waveman: {
    url: process.env.WAVE_ENDPOINT || "http://demo-wave-man:8083/wavify",
  },
  api: {
    url: process.env.API_ENDPOINT || "http://demo-api:8080/api/v1/demo",
    port: process.env.PORT || "8080",
  },
};

module.exports = endpoints;
