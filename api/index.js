const client = require('./db.js');
const cors = require('cors');
const express = require('express');
const { cover } = require('./demo-cover.js');
const logger = require('@zoomoid/log');

var app = express();
const demoRouter = express.Router();

app.use(cors());
app.use(express.json());

const url = process.env.MONGOURL || 'mongodb://demo-mongodb:27017';
const apiPort = process.env.PORT || '8080';

app.use('/api/demo', demoRouter);

if(!process.env.TOKEN){
  logger.warn(`No auth token provided as ENV variable. POST and DELETE routes will not work`);
}

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

/**
 * A very simply express.js route guard middleware which just compares a sent token against an expected one.
 * Neither uses atomic comparison of passwords nor does it cover all expected cases.
 * It works on a best-effort strategy.
 */
const guard = (request, response, next) => {
  if(!process.env.TOKEN){
    logger.error(`No token provided as ENV variable`);
    response.status(500).json({"error": "Error while authenticating"});
    return
  }
  if(request.body.token && request.body.token === process.env.TOKEN){
    logger.info(`Sucessfully authenticated request`);
    next();
  } else {
    logger.error(`Received unauthorized request`, `attempted_with`, `${request.body.token}`);
    response.status(401).json({"error": "Unauthorized"});
  }
}

demoRouter.route('/file')
  /**
   * Add new track to API
   */
  .post(guard, async (req, res, next) => {
    try {
      const doc = req.body;
      doc.type = 'Track';
      const c = await clientStub;
      resp = await c.insertOne(doc);
      logger.info(`Successfully inserted document into MongoDB storage`, `inserted`, `${JSON.stringify(req.body.track).substr(0, 80)}...`);
      res.status(200).json({
        'success': true,
        'response': resp,
      });
    } catch (err) {
      logger.error(`Received error from MongoDB (driver)`, `response`, err);
      next(err);
    }
  })
  /**
   * Delete track from API
   */
  .delete(guard, async (req, res, next) => {
    try {
      const c = await clientStub;
      resp = await c.deleteOne({ path: req.body.path, type: 'Track' });
      logger.info(`Successfully deleted document from MongoDB storage`, `deletedTrack`, `${req.body.path}`);
      res.status(200).json({
        'success': true,
        'response': resp,
      });
    } catch (err) {
      logger.error(`Received error from MongoDB (driver)`, `response`, err);
      next(err);
    }
  });

demoRouter.route('/folder')
  /**
   * Add new album to API
   */
  .post(guard, async (req, res, next) => {
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
      logger.error(`Received error from MongoDB (driver)`, `response`, err);
      next(err);
    }
  })
  /**
   * Delete album from API
   */
  .delete(guard, async (req, res, next) => {
    try {
      const path = req.body.path;
      const c = await clientStub;
      resp = await Promise.all([
        c.deleteMany({ type: 'Track', namespace: path }),
        c.deleteOne({ type: 'Album', name: path }),
      ]);
      logger.info(`Successfully deleted document from MongoDB storage`, `deletedAlbum`, `${req.body.path}`);

      res.status(200).json({
        'success': true,
        'response': resp,
      });
    } catch (err) {
      logger.error(`Received error from MongoDB (driver)`, `response`, err);
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
    logger.error(`Received error from MongoDB (driver)`, `response`, err);
    next(err);
  }
});

/**
 * Demo stub route for client testing
 */
app.get('/api/stub/shades-of-yellow', async (req, res, next) => {
  try {
    logger.info(`Received request to demo route`, `route`, req.route)
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
    logger.error(`Demo object seems to have an error`);
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
    logger.error(`Received error from MongoDB (driver)`, `response`, err);
    next(err);
  }
});

app.listen(apiPort, () => {
  logger.info(`Started API server`, `port`, apiPort, `time`, new Date().toLocaleString('de-DE'));
});