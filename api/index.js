import { log } from '@zoomoid/log';
import client from './db.js';
import cors from 'cors';
import express from 'express';
import { cover } from './demo-cover.js';

var app = express();
const demoRouter = express.Router();

app.use(cors());
app.use(express.json());

const url = process.env.MONGOURL || 'mongodb://demo-mongodb:27017';
const apiPort = process.env.PORT || '8080';

app.use('/api/demo', demoRouter);

/**
 * Default MongoDB database for the demo domain
 * This is namespaced to make it more easily extensible later on
 */
const demoDB = process.env.DB || 'demo'

/**
 * Refactored mongodb client collection
 * Stub this, as we then can simply await the already resolved Promise kept globally available rather than open a new
 * connection on each API call
 */
const clientStub = client(url, demoDB);

demoRouter.route('/file')
  /**
   * Add new track to API
   */
  .post(async (req, res, next) => {
    try {
      const doc = req.body;
      doc.type = 'Track';
      const c = await clientStub;
      resp = await c.insertOne(doc);
      log(`Successfully inserted document into MongoDB storage`, `type`, `Info`, `inserted`, `${JSON.stringify(req.body).substr(0, 80)}...`);
      res.status(200).json({
        'success': true,
        'response': resp,
      });
    } catch (err) {
      log(`Received error from MongoDB (driver)`, `type`, `Error`, `response`, err);
      next(err);
    }
  })
  /**
   * Delete track from API
   */
  .delete(async (req, res, next) => {
    try {
      const c = await clientStub;
      resp = await c.deleteOne({ path: req.body.path, type: 'Track' });
      log(`Successfully deleted document from MongoDB storage`, `type`, `Info`, `deletedTrack`, `${req.body.path}`);
      res.status(200).json({
        'success': true,
        'response': resp,
      });
    } catch (err) {
      log(`Received error from MongoDB (driver)`, `type`, `Error`, `response`, err);
      next(err);
    }
  });

demoRouter.route('/folder')
  /**
   * Add new album to API
   */
  .post(async (req, res, next) => {
    try {
      const doc = {
        type: 'Album',
        name: req.body.path
      };

      const c = await clientStub;
      resp = await c.insertOne(doc);
      res.status(200).json({
        'success': true,
        'response': resp,
      });
    } catch (err) {
      log(`Received error from MongoDB (driver)`, `type`, `Error`, `response`, err);
      next(err);
    }
  })
  /**
   * Delete album from API
   */
  .delete(async (req, res, next) => {
    try {
      const path = req.body.path;
      const c = await clientStub;
      resp = await Promise.all([
        c.deleteMany({ type: 'Track', namespace: path }),
        c.deleteOne({ type: 'Album', name: path }),
      ]);
      log(`Successfully deleted document from MongoDB storage`, `type`, `Info`, `deletedAlbum`, `${req.body.path}`);

      res.status(200).json({
        'success': true,
        'response': resp,
      });
    } catch (err) {
      log(`Received error from MongoDB (driver)`, `type`, `Error`, `response`, err);
      next(err);
    }
  });

/**
 * Get all albums from the API
 */
demoRouter.get('/', async (req, res, next) => {
  try {
    const c = await clientStub;

    resp = await c.find({ type: 'Album' });

    res.status(200).json({
      'success': 'true',
      'data': resp
    });
  } catch (err) {
    log(`Received error from MongoDB (driver)`, `type`, `Error`, `response`, err);
    next(err);
  }
});

/**
 * Demo stub route for client testing
 */
app.get('/api/stub/shades-of-yellow', async (req, res, next) => {
  try {
    log(`Received request to demo route`, `type`, `Info`, `route`, req.route)
    res.status(200).json([
      {
        title: 'Shades Of Yellow',
        album: 'Shades Of Yellow',
        track: {
          no: 1,
          of: 1,
        },
        bpm: 120,
        disk: {
          no: 1,
          of: 1,
        },
        albumartist: 'Zoomoid',
        composer: 'Alexander Bartolomey',
        artist: 'Zoomoid',
        genre: 'House',
        year: 2020,
        comment: '',
        bitrate: 320000,
        lossless: false,
        duration: 377,
        path: '/a/zoomoid/demo/shades-of-yellow/Shades Of Yellow.mp3',
        filename: 'Shades Of Yellow.mp3',
        namespace: 'shades-of-yellow',
        url: 'https://cdn.occloxium.com/a/zoomoid/demo/shades-of-yellow/Shades Of Yellow.mp3',
        cover: cover,
      }
    ])
  } catch (err) {
    log(`Demo object seems to have an error`);
    next(err);
  }
});

/**
 * Get all tracks from the API for a certain namespace from the API
 */
demoRouter.get('/:namespace', async (req, res, next) => {
  try {
    const c = await clientStub;

    resp = await c.find({ type: 'Track', namespace: req.params.namespace });

    res.status(200).json({
      'success': 'true',
      'data': resp
    });
  } catch (err) {
    log(`Received error from MongoDB (driver)`, `type`, `Error`, `response`, err);
    next(err);
  }
});

app.listen(apiPort, () => {
  log(`Started API server`, `type`, `Info`, `port`, apiPort, `time`, new Date().toLocaleDateString('de-DE'));
});