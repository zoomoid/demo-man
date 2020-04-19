const mongodb = require('mongodb');
const logger = require('@zoomoid/log');

const client = async (url, db) => {
  const client = new mongodb.MongoClient(url);
  try {
    await client.connect()
    return client.db(db).collection(db);
  } catch (err) {
    logger.error(`Encountered error while connecting to mongodb`, `error`, err);
  }
}

module.exports = client