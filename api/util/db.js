const mongodb = require("mongodb");
const logger = require("@zoomoid/log");

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
        // console.log(state.db);
        logger.info(
          "Connected to mongodb",
          "url",
          url,
          "collection",
          state.name
        );
        resolve(state.db);
      })
      .catch((err) => {
        console.log(err);
        logger.error(
          "Error while connecting connection",
          "level",
          "db.connect",
          "error",
          err
        );
        reject(err);
      });
  });
};

exports.get = () => {
  // logger.info('Access to collection recorded', 'collection', state.__collection);
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
          logger.error(
            "Encountered error while closing connection",
            "level",
            "db.close",
            "error",
            err
          );
          reject(err);
        });
    }
  });
};
