const chokidar = require('chokidar');
const metadata = require('music-metadata');
const fetch = require('node-fetch'); 
const logger = require('@zoomoid/log');
const p = require('path');
const fs = require('fs');

/**
 * API Server endpoint to query
 */
const apiEndpoint = process.env.API_ENDPOINT || 'http://demo-api/api/v1/demo'

const url = JSON.parse(process.env.PUBLIC_PATH) || {
  prefix: 'https',
  hostname: 'files.zoomoid.de',
  dir: ``, // needs to be slash-terminated!
};

if(!process.env.TOKEN){
  logger.warn(`No API token provided. Protected routes will not work properly.`);
}

const token = process.env.TOKEN;

/**
 * Volume path to watch
 * 
 * General guidelines for using this watchdog: 
 * We listen to all changes in 2 layers of depth, i.e., we only get notified for changes to the relative root
 * and one layer below. This enables us to group tracks together to albums, as we can create folders and
 * watch for file changes inside the new folders.
 * Newly created folders are treated as albums being created.
 * Files created inside these folders are treated as tracks being created.
 * 
 * The same applies to deletion of said folders/files.
 * 
 * Hierarchy:
 * 
 * ./ (relative root; determined by "VOLUME")
 * |- album1
 *    |- track1.mp3
 *    |- track2.wav
 *    |- track3.mp3
 * |- album2
 *    |- track1.mp3
 *    |- track2.flac
 * |- album3
 * 
 * This is a valid file tree for our example watchdog 
 */
const volume = process.env.VOLUME || `.`; // needs to be slash-terminated!

const fileWatcher = chokidar.watch(`${volume}/**/*.mp3`, {
  ignoreInitial: true,
  persistent: true, 
  atomic: true, 
  depth: 2,
  awaitWriteFinish: true,
});
const folderWatcher = chokidar.watch(`${volume}/`, {
  ignored: '**/.**',
  ignoreInitial: true,
  persistent: true, 
  atomic: true, 
  depth: 1,
  awaitWriteFinish: true,
});
logger.info(`Watching directory`, `volume`, volume);

folderWatcher.on('addDir', async path => {

  if(path == `${volume}/`){
    logger.info(`Skipping docker volume mount event`, `directory`, path);
    return
  }

  logger.info(`Directory has been added`, `directory`, path, `timestamp`, new Date().toLocaleString('de-DE'));

  let folder = p.basename(path);
  logger.info(`Created new folder`, `path`, path, `folder`, folder);

  await postAlbumToAPI(folder);
});

/**
 * Watcher for all new files being added
 * Kicks of the whole process
 */
fileWatcher.on('add', async path => {
  logger.info(`File has been added`, `file`, path, `timestamp`, new Date().toLocaleString('de-DE'));

  const reducedFilename = path.replace(`${volume}/`,``); // strips the volume mount prefix from the filename

  let meta = await readMetadata(reducedFilename);
  logger.info(`Read metadata of audio file`, `file`, reducedFilename, `data`, meta, `length`, meta.length);
  
  logger.info(`Requesting insertion of indexed audio file`, `filename`, p.basename(reducedFilename), `db`, url);
  await postTrackToAPI(meta);
});

/**
 * Watcher for file deletions
 */
fileWatcher.on('unlink', async path => {
  const reducedFilename = path.replace(`${volume}/`,``); // strips the volume mount prefix from the filename

  logger.info(`File  has been removed`, `file`, reducedFilename, `time`, new Date().toLocaleString('de-DE'));
 
  // API Server querys for full path on delete request
  await removeTrackFromAPI(reducedFilename);
});

/**
 * Watcher for album deletions
 */
folderWatcher.on('unlinkDir', async path => {
  const reducedFilename = path.replace(`${volume}/`,``); // strips the volume mount prefix from the filename

  logger.info(`Directory has been removed`, `file`, reducedFilename, `time`, new Date().toLocaleString('de-DE'));
  
  // API Server querys for full path on delete request
  await removeAlbumFromAPI(reducedFilename);
});

/**
 * Requests creation of a new track
 * @param {*} data track data to post to the API
 */
async function postTrackToAPI(data) {
  const resp = await post(`${apiEndpoint}/file`, data);
  if (resp && resp.status == 200) {
    logger.info(`Successfully posted track to API`, `response`, resp);
  } else {
    logger.error(`Received error status from API`, `response`, resp);
  }
}

/**
 * Requests creation of a new album
 * @param {string} album album title
 */
async function postAlbumToAPI(album) {
  const resp = await post(`${apiEndpoint}/folder`, {'album': album});
  if (resp && resp.status == 200) {
    logger.info(`Successfully posted album to API`, `response`, resp);
  } else {
    logger.error(`Received error status from API`, `response`, resp);
  }
}

/**
 * Requests deletion of a previously added audio file
 * @param {string} path path of the audio file to query the DB with
 */
async function removeTrackFromAPI(path) {
  const resp = await del(`${apiEndpoint}/file`, {'path': path});
  logger.info(`Requesting deletion of indexed track`, `file`, path, `db`, url, `ep`, apiEndpoint);

  if (resp && resp.status == 200) {
    logger.info(`Successfully deleted track from API`, `response`, resp);
  } else {
    logger.error(`Received error status from API`, `response`, resp);
  }
}

/**
 * Requests deletion of a previously added album
 * @param {*} path directory name that we need to delete
 */
async function removeAlbumFromAPI(path) {
  const resp = await del(`${apiEndpoint}/folder`, {'path': path});
  logger.info(`Requesting deletion of indexed album`, `file`, path, `db`, url, `ep`, apiEndpoint);

  if (resp && resp.status == 200) {
    logger.info(`Successfully deleted album from API`, `response`, resp);
  } else {
    logger.error(`Received error status from API`, `response`, resp);
  }
}

/**
 * Shorthand function for HTTP POST requests
 * @param {string} ep Endpoint URL
 * @param {*} data data to post
 */
async function post(ep, data){
  return __request('POST', ep, data);
}

/**
 * Shorthand function for HTTP DELETE request
 * @param {string} ep endpoint url
 * @param {*} data data to delete
 */
async function del(ep, data){
  return __request('DELETE', ep, data);
}

/**
 * Your generic http wrapper using node-fetch
 * @param {string} method http method
 * @param {string} ep endpoint url
 * @param {*} data data object to be posted
 */
async function __request(method, ep, data){
  try {
    if(!process.env.DRY_RUN){
      data.token = token;
      const resp = fetch(ep, {
        mode: 'cors',
        method: method,
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });
      return resp;
    } else {
      logger.warn(`Dry run! Not sending request to API`, `endpoint`, `${ep}`, `data`, data);
      return {
        "success": true,
        "note": "dry_run",
        "data": data,
      }
    }
  } catch (err) {
    logger.error(`Received error response from backend`, `response`, err);
  }
}

/**
 * Reads a newly added mp3 file for its metadata and returns an object with all relevant information
 * @param {string} path to new file 
 */
async function readMetadata(path){
  console.log(path);
  try {
    logger.info(`Reading IDv3 off of audio file`, `path`, path);
    const src = await metadata.parseFile(p.join(volume, path));

    logger.info(`Parsed audio file metadata`,  `dirname`, p.dirname(path), `filename`, p.basename(path));
  
    const mimeType = src.common.picture[0].format;
    const abspath = p.join(volume, p.dirname(path), `cover.${mimeType.replace("image/", "")}`);
    logger.info("Writing cover to file", "filename", abspath, "mimeType", mimeType);
    fs.writeFileSync(abspath, src.common.picture[0].data);

    return {
      "year": src.common.year,
      "track": src.common.track,
      "title": src.common.title,
      "artist": src.common.artist,
      "albumartist": src.common.albumartist,
      "album": src.common.album,
      "genre": src.common.genre,
      "composer": src.common.composer,
      "comment": src.common.comment,
      "bpm": src.common.bpm,
      "type": src.format.container,
      "duration": src.format.duration,
      "lossless": src.format.lossless,
      "bitrate": src.format.bitrate,
      "cover": {
        "mimeType": mimeType,
        "url": `${url.prefix}://${url.hostname}/${url.dir}${p.basename(p.dirname(path))}${p.sep}cover.${mimeType.replace("image/", "")}`
      },
      "path": path, // full path of file INSIDE volume
      "filename": p.basename(path), // this gets us the last element of the array inline
      "namespace": p.basename(p.dirname(path)),
      "url": `${url.prefix}://${url.hostname}/${url.dir}${p.basename(p.dirname(path))}${p.sep}${p.basename(path)}` // this monster contains the final shareable url on the webserver
    }    
  } catch (err) {
    console.log(err);
    logger.error("Error while parsing audio metadata", "error", err);
  }

}