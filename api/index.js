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
const apiEndpoint = process.env.API_ENDPOINT || 'http://demo-api:8080/api/v1/demo'
const wavemanUrl = process.env.WAVE_ENDPOINT || 'http://demo-wave-man:8083/wavify'
app.use('/api/v1/demo', demoRouter);

if(!process.env.TOKEN){
  logger.error(`No auth token provided as ENV variable`);
  process.exit(1);
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
    process.exit(1);
  }
  if(request.body.token && request.body.token === process.env.TOKEN){
    // logger.info(`Sucessfully authenticated request. Detaching token from body`);
    delete request.body.token;
    next();
  } else {
    logger.error(`Received unauthorized request`, `attempted_with`, `${request.body.token}`);
    response.status(401).json({"error": "Unauthorized"});
  }
}

const waveManHook = (ns, fn) => {
  const path = `${ns}/${fn}`;
  logger.info("Requesting waveform from wave-man", "url", wavemanUrl, "track", fn, "namespace", ns);
  return new Promise((resolve, reject) => {
    fetch(wavemanUrl, { 
      method: 'POST',
      body: JSON.stringify({
        uri: path,
      }),
      headers: { 'Content-Type': 'application/json' } 
    }).then((res) => res.json()).then((res) => {
      logger.info("wave-man rendered audio waveform", "track", fn, "namespace", ns);
      resolve(res);
    }).catch((err) => {
      logger.error("wave-man responded unexpectedly", "error", err, "track", fn, "namespace", ns, "waveman", wavemanUrl);
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

app.get('/test', (_, response) => {
  fetch(wavemanUrl.replace('wavify', 'healthz'), { method: 'GET' }).then((res) => {
    if (res.status == 200) {
      response.status(200).send("ok");
    } else {
      logger.error('Error establishing link to wave-man', 'error', res.statusText);
      response.status(res.status).send(res.statusText);
    }
  }).catch((err) => {
    logger.error('Error establishing link to wave-man', 'error', err);
    response.status(500).send(err);
  });
});

demoRouter.route('/track')
  /**
   * Add new track to API and queries wave-man for waveforms
   */
  .post(guard, async (req, res, next) => {
    // logger.info('Received POST request on /file route');
    try {
      const track = req.body.track;
      track.type = 'Track';
      track._id = new ObjectID();
      try {
        svg = await waveManHook(track.namespace, track.filename);
        waveform = {
          type: 'Waveform',
          namespace: track.namespace,
          track_id: track._id,
          full: svg.full,
          small: svg.small,
        }
        resp = await Promise.all([
          db.get().insertOne(track),
          db.get().insertOne(waveform),
        ]);
        logger.info('Added track to namespace', 'level', 'POST /track', 'namespace', track.namespace, 'response', resp);
        res.status(200).json({
          'response': resp,
        });
      } catch (err) {
        logger.error('wave-man failed to respond with waveform', 'level', 'POST /track', 'response', err);
        next(err);
      }
    } catch (err) {
      logger.error('Received error from MongoDB', 'level', 'POST /track', 'response', err);
      next(err);
    }
  })
  /**
   * DELETE track from API
   */
  .delete(guard, async (req, res, next) => {
    try {
      resp = await db.get().deleteMany({ path: req.body.path, type: 'Track' });
      logger.info('Deleted track from namespace', 'level', 'DELETE /track', 'track', `${req.body.path}`);
      res.status(200).json({
        'response': resp,
      });
    } catch (err) {
      logger.error('Received error from MongoDB', 'level', 'DELETE /track', 'response', err);
      next(err);
    }
  });

demoRouter.route('/namespace')
  /**
   * ADD new album to API
   */
  .post(guard, async (req, res, next) => {
    try {
      const doc = {
        type: 'Namespace',
        name: req.body.namespace,
        url: `${apiEndpoint}/${req.body.namespace}`,
      };
      resp = await db.get().insertOne(doc);
      res.status(200).json({
        'response': resp,
      });
    } catch (err) {
      logger.error('Received error from MongoDB', 'level', 'POST /namespace', 'response', err);
      next(err);
    }
  })
  /**
   * DELETE album from API
   */
  .delete(guard, async (req, res, next) => {
    try {
      const path = req.body.namespace;
      const c = db.get();
      resp = await Promise.all([
        c.deleteMany({ type: 'Track', namespace: path }),
        c.deleteMany({ type: 'Namespace', name: path }),
        c.deleteMany({ type: 'Waveform', namespace: path }),
      ]);
      logger.info('Deleted album', 'level', 'DELETE /namespace', 'namespace', `${req.body.namespace}`);
      res.status(200).json({
        'response': resp,
      });
    } catch (err) {
      logger.error('Received error from MongoDB', 'level', 'DELETE /namespace', 'response', err);
      next(err);
    }
  });

/**
 * GET all namespaces/albums
 */
demoRouter.get('/', async (req, res, next) => {
  try {
    resp = await db.get().find({ type: 'Namespace' }).toArray();
    res.status(200).json({
      'data': resp
    });
  } catch (err) {
    logger.error('Received error from MongoDB', 'level', 'GET /', 'response', err);
    next(err);
  }
});

/**
 * GET all tracks from the API for a certain namespace from the API
 */
demoRouter.get('/:namespace', async (req, res, next) => {
  try {
    resp = await db.get().find({ type: 'Track', namespace: req.params.namespace }).toArray();
    resp = resp.map((t) => {
      t.el = `${apiEndpoint}/${req.params.namespace}/${t._id}/`;
      return t
    });
    res.status(200).json({
      'data': resp
    });
  } catch (err) {
    logger.error('Received error from MongoDB', 'level', 'GET /:namespace', 'response', err);
    next(err);
  }
});

/**
 * GET the cover of a specified namespace/album
 */
demoRouter.get('/:namespace/cover', async (req, res, next) => {
  try {
    resp = await db.get().findOne({ type: 'Track', namespace: req.params.namespace });
    res.redirect(resp.cover.public_url);
  } catch (err) {
    logger.error('Error while redirecting to cover', 'level', 'GET /:namespace/cover', 'namespace', `${req.params.namespace}`, `error`, err);
    next(err);
  }
});

demoRouter.route('/:namespace/waveform').get(async (req, res, next) => {
  try {
    let resp = await db.get().aggregate([{ 
      $match: {
        type: 'Waveform',
        namespace: req.params.namespace,
      }
    }, {
      $lookup: {
        from: "demo",
        localField: "track_id",
        foreignField: "_id",
        as: "track",
      }
    }]).toArray();
    resp = resp.map((waveform) => {
      switch(req.query.mode){
        case 'small':
          return {
            waveform: waveform.small.replace(/\\/g, ''),
          }
        case 'full': 
          return {
            waveform: waveform.full.replace(/\\/g, ''),
          }
        default:
          return {
            waveform: {
              full: waveform.full.replace(/\\/g, ''),
              small: waveform.small.replace(/\\/g, ''),
            },
          }
      }
    });
    res.json({data: resp});
  } catch (err) {
    logger.error('Error while loading waveforms', 'level', 'GET /:namespace/waveform', 'namespace', `${req.params.namespace}`, 'error', err);
    next(err);
  }
});

/**
 * GET a specific track from the API
 */
demoRouter.get('/:namespace/:track', async (req, res, next) => {
  try {
    resp = await db.get().findOne({ type: 'Track', namespace: req.params.namespace, _id: ObjectID.createFromHexString(req.params.track) });

    if(resp){
      resp.waveformUrl = {
        full: `${apiEndpoint}/${req.params.namespace}/${req.params.track}/waveform/full`,
        small: `${apiEndpoint}/${req.params.namespace}/${req.params.track}/waveform/small`
      };
      res.json(resp);  
    } else {
      res.status(404).send("Not found");
    }
  } catch (err) {
    logger.error('Error while loading track', 'level', 'GET /:namespace/:track', 'namespace', `${req.params.namespace}`, 'track.id', `${req.params.track}`, 'error', err);
    next(err);
  }
});


demoRouter.route('/:namespace/:track/waveform')
  /**
   * GET a specific waveform for a specific track from the API server
   * :track is supposed to be a string of ObjectId of the track in question
   * :mode has to be either "full" or "small", otherway an error is returned
   * You can also send addition query "color" such that all templated colors get replaced with your color
   */
  .get(async (req, res, next) => {
    try {
      const resp = await db.get().findOne({ 
        type: 'Waveform', 
        track_id: ObjectID.createFromHexString(req.params.track),
        namespace: req.params.namespace,
      });
      if(resp){
        let waveform;
        switch (req.query.mode) {
          case 'small':
            waveform = resp.small.replace(/\\/g, '');
            break;
          case 'full':
            waveform = resp.full.replace(/\\/g, '');
            break;
          default:
            res.status(405).send("Unsupported mode");
            next("Unsupported mode");
            break;
        }
        let color = '#F58B44'
        console.log(req.query);
        if (req.query.color) {
          color = req.query.color;
        }
        waveform = waveform.replace(/{{.color}}/g, `#${color}`);
        res.set({
          "Content-Type": "image/svg+xml"
        });
        res.send(waveform)
      } else {
        res.status(404).send("Not found");
      }
    } catch (err) {
      logger.error('Error while loading waveform', 'level', 'GET /namespace:/:track/waveform/:mode', 'namespace', `${req.params.namespace}`, 'track.id', `${req.params.track}`, 'error', err);
      next(err);
    }
  })
  /** 
   * for a given track, regenerate waveforms by querying the wave-man again. This might be useful
   * if we change the config maps for the wave-man and do not want to remove the existing track to
   * retrigger the generation 
   */
  .patch(guard, async (req, res, next) => {
    try {
      // Fetch track url from database
      const { url, name } = await db.get().findOne(
        { _id: ObjectID.createFromHexString(req.params.track), type: 'Track' }, 
        { url: 1, name: 1 }
      );
      const svg = await waveManHook(url, name);
      resp = await db.get().updateOne(
        { track_id: ObjectID.createFromHexString(req.params.track), type: "Waveform" }, 
        { full: svg.full, small: svg.small }
      );
      logger.info('Successfully updated waveform', 'updated', `${name}`);
      res.status(200).json({
        'response': resp,
      });
    } catch (err) {
      console.error(err);
      logger.error('Received error along the way of retriggering waveform generation', `response`, err);
      next(err);
    }
  });

db.connect(`${url}/${demoDB}`, demoDB).then(() => {
  app.listen({ port: apiPort, host: "0.0.0.0" }, (err) => {
    if(err){
      logger.error('Error occured on API server startup', 'error', err);
    } else {
      logger.info('Started API server', 'port', apiPort, 'time', new Date().toLocaleString('de-DE'));
    }
  });
}).catch((err) => {
  logger.error('MongoDB connector failed to connect to database', 'error', err);
  process.exit(1);
});
