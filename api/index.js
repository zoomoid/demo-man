const db = require('./db.js');
const cors = require('cors');
const express = require('express');
const logger = require('@zoomoid/log');
const fetch = require('node-fetch');
const ObjectID = require('mongodb').ObjectID;
var app = express();
const demoRouter = express.Router();

app.use(cors());
// app.use(pino());
app.use(express.json({
  limit: "3mb"
}));

const url = process.env.MONGOURL || 'mongodb://demo-mongodb:27017';
const apiPort = process.env.PORT || '8080';
const apiEndpoint = process.env.API_ENDPOINT || 'http://demo-api/api/v1/demo'
const wavemanUrl = process.env.WAVE_ENDPOINT || 'http://demo-wave-man/wavify'
app.use('/api/v1/demo', demoRouter);

if(!process.env.TOKEN){
  logger.warn(`No auth token provided as ENV variable. POST and DELETE routes will not work`);
}

/**
 * Default MongoDB database for the demo domain
 * This is namespaced to make it more easily extensible later on
 */
const demoDB = process.env.DB || 'demo'

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
    logger.info(`Sucessfully authenticated request. Detaching token from body`);
    delete request.body.token;
    next();
  } else {
    logger.error(`Received unauthorized request`, `attempted_with`, `${request.body.token}`);
    response.status(401).json({"error": "Unauthorized"});
  }
}

const waveManHook = (url, name) => {
  logger.info("Requesting waveform from wave-man", "url", wavemanUrl, "track", name)
  return new Promise((resolve, reject) => {
    fetch(wavemanUrl, { 
      method: 'POST',
      body:    JSON.stringify({
        uri: url,
      }),
      headers: { 'Content-Type': 'application/json' } 
    }).then((res) => res.json()).then((res) => {
      logger.info("WaveMan rendered audio waveform", "track", name, "trackUrl", url);
      resolve(res.svg);
    }).catch((err) => {
      logger.error("WaveMan responded unexcepectedly", "error", err, "track", name, "wavemanUrl", wavemanUrl, "trackUrl", url);
      reject(err);
    });
  });
}

app.get('/ping', (_, response) => {
  response.send("pong.");
});

app.get('/healthz', (_, response) => {
  response.status(200).send("ok");
});

demoRouter.route('/file')
  /**
   * Add new track to API
   */
  .post(guard, async (req, res, next) => {
    logger.info('Received POST request on /file route');
    try {
      const doc = req.body;
      doc.type = 'Track';

      // Get SVG waveform from waveman
      svg = await waveManHook(doc.url, doc.title);
      doc.waveform = svg

      resp = await db.get().insertOne(doc);
      logger.info(`Successfully inserted document into MongoDB storage`, `inserted`, `${JSON.stringify(req.body.track).substr(0, 80)}...`);
      res.status(200).json({
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
      resp = await db.get().deleteOne({ path: req.body.path, type: 'Track' });
      logger.info(`Successfully deleted document from MongoDB storage`, `deletedTrack`, `${req.body.path}`);
      res.status(200).json({
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
    logger.info('Received POST request on /folder route', `path`, req.body);

    try {
      const doc = {
        type: 'Album',
        name: req.body.album,
        url: `${apiEndpoint}/${req.body.album}`,
      };

      resp = await db.get().insertOne(doc);
      res.status(200).json({
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
      const c = db.get();
      resp = await Promise.all([
        c.deleteMany({ type: 'Track', namespace: path }),
        c.deleteOne({ type: 'Album', name: path }),
      ]);
      logger.info(`Successfully deleted document from MongoDB storage`, `deletedAlbum`, `${req.body.path}`);

      res.status(200).json({
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
  logger.info(`Received request to /`, `route`, req.route)

  try {
    resp = await db.get().find({ type: 'Album' }).toArray();
    
    res.status(200).json({
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
        cover: {
          url: 'https://cdn.occloxium.com/a/zoomoid/demo/shades-of-yellow/cover.png',
          format: 'image/png',
        },
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
    resp = await db.get().find({ type: 'Track', namespace: req.params.namespace }).toArray();

    res.status(200).json({
      'data': resp
    });
  } catch (err) {
    logger.error(`Received error from MongoDB (driver)`, `response`, err);
    next(err);
  }
});

demoRouter.get('/:namespace/cover', async (req, res, next) => {
  try {
    resp = await db.get().findOne({ type: 'Track', namespace: req.params.namespace });

    res.redirect(resp.cover.url);
  } catch (err) {
    logger.error('Error while fetching cover image', `namespace`, `${req.params.namespace}`, `error`, err);
    next(err);
  }
});

demoRouter.get('/:namespace/:track/waveform', async (req, res, next) => {
  try {
    resp = await db.get().findOne({ type: 'Track', namespace: req.params.namespace, _id: ObjectID.createFromHexString(req.params.track) });

    if(resp){
      res.set({
        "Content-Type": "image/svg+xml"
      }).send(resp.waveform.replace(/\\/g, ''));  
    } else {
      res.status(404).send("Not found");
    }
  } catch (err) {
    logger.error('Error while loading waveform', `namespace`, `${req.params.namespace}`, `Track.id`, `${req.params.track}`, `error`, err);
    next(err);
  }
});

db.connect(`${url}/${demoDB}`, demoDB).then(() => {
  app.listen({ port: apiPort, host: "0.0.0.0" }, (err) => {
    if(err){
      logger.error(`Error occured on API server startup`, `error`, err);
    } else {
      logger.info(`Started API server`, `port`, apiPort, `time`, new Date().toLocaleString('de-DE'));
    }
  });
}).catch((err) => {
  logger.error(`MongoDB connector failed to connect to database`, `error`, err);
  process.exit(1);
})

