const mongodb = require('mongodb');
const logger = require('@zoomoid/log');

const state = {
  db: null
}

exports.connect = (url, db) => {
  return new Promise((resolve, reject) => {
    if (state.db) {
      logger.info(`Using cached database connection`);
      resolve(state.db);
    } 

    mongodb.MongoClient.connect(url).then((db) => {
      logger.info(`Successfully connected to mongodb`);

      state.db = db;
      resolve(state.db);
    }).catch((err) => {
      logger.error(`Encountered error while connecting connection`, `error`, err);
      reject(err);
    });
  });
}

exports.get = () => {
  return state.db;
}

exports.close = () => {
  return new Promise((resolve, reject) => {
    if (state.db) {
      state.db.close().then(() => {
        state.db = null
        resolve();
      }).catch((err) => {
        logger.error(`Encountered error while closing connection`, `error`, err);
        reject(err);
      })
    }
  });
}
