const mongodb = require('mongodb');
const logger = require('@zoomoid/log');

const state = {
  db: null,
  collection: null,
}

exports.connect = (url, collection) => {
  return new Promise((resolve, reject) => {
    if (state.db) {
      logger.info(`Using cached database connection`);
      resolve(state.db);
    } 

    mongodb.MongoClient.connect(url).then((db) => {
      state.collection = collection;
      state.db = db;
      console.log(state.db);
      logger.info(`Successfully connected to mongodb`, `collection`, state.collection);
      resolve(state.db);
    }).catch((err) => {
      console.log(err);
      logger.error(`Encountered error while connecting connection`, `error`, err);
      reject(err);
    });
  });
}

exports.get = () => {
  return state.db.collection(state.collection);
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
