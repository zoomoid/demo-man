import { log } from './util';
import client from './db';
import cors from 'cors';
import express from 'express';

var app = express();

app.use(cors());
app.use(express.json());

const url = process.env.MONGOURL || 'mongodb://zoomoid-music:27017';

app.post('/demo', async (req, res, next) => {
  const dbName = process.env.DB || 'demo'
  const c = await client(url, dbName);
  try {
    resp = await c.insertOne(req.body);
    log(`Successfully inserted document into MongoDB storage`, `type`, `Info`, `inserted`, `${JSON.stringify(req.body).substr(0, 200)}...`);
    res.status(200).json({
      'success': true,
      'response': resp,
    });
  } catch (err) {
    log(`Received error from MongoDB (driver)`, `type`, `Error`, `response`, err);
    next(err);
  }
});

