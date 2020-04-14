import { default as mongodb } from 'mongodb';

const client = async (url, db) => {
  const client = new mongodb.MongoClient(url);
  try {
    await client.connect()
    return client.db(db).collection(db);
  } catch (err) {
    console.error(err);
  }
}

export default client