const mongodb = require("mongodb");
const logger = require("@occloxium/log").v2;

const state = {
  name: null,
  db: null,
  collection: null,
};

exports.connect = (url, database) => {
  return new Promise((resolve, reject) => {
    if (state.db) {
      logger.info("Using cached database connection");
      resolve(state.db);
    }
    mongodb.MongoClient.connect(url, { useUnifiedTopology: true })
      .then((db) => {
        state.name = database;
        state.db = db.db();
        state.collection = state.db.collection(state.name);
        logger.info("Connected to mongodb", {
          url: url,
          collection: state.name,
        });
        resolve(state.db);
      })
      .catch((err) => {
        console.log(err);
        logger.error("Error while connecting connection", {
          in: "db.connect",
          error: err,
        });
        reject(err);
      });
  });
};

exports.get = () => {
  return state.collection;
};

exports.close = () => {
  return new Promise((resolve, reject) => {
    if (state.db) {
      state.db
        .close()
        .then(() => {
          state.db = null;
          resolve();
        })
        .catch((err) => {
          logger.error("Encountered error while closing connection", {
            in: "db.close",
            error: err,
          });
          reject(err);
        });
    }
  });
};
