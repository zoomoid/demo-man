import chokidar from 'chokidar';
import * as metadata from 'music-metadata';
import fetch from 'node-fetch'; 
import { log } from '@zoomoid/log';
import * as p from 'path';

/**
 * API Server endpoint to query
 */
const apiEndpoint = process.env.API_ENDPOINT || 'http://demo-zoomoid'

const url = JSON.parse(process.env.PUBLIC_PATH) || {
  prefix: 'https',
  hostname: 'cdn.occloxium.com',
  ftpPrefix: `a${p.sep}zoomoid${p.sep}demo${p.sep}`, // needs to be slash-terminated!
};

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
const volume = process.env.VOLUME || `.${p.sep}files${p.sep}`; // needs to be slash-terminated!

const fileWatcher = chokidar.watch(`${volume}**.mp3`, {persistent: true, atomic: true, depth: 2});
const folderWatcher = chokidar.watch(`${volume}`, {persistent: true, atomic: true, depth: 1});

folderWatcher.on('addDir', async path => {
  log(`Directory has been added`, `type`, `Info`, `directory`, path, `timestamp`, new Date().toLocaleDateString('de-DE'));
  
  let folder = p.basename(path);
  log(`Created new folder`, `type`, `Info`, `path`, path, `folder`, folder);

  await postAlbumToAPI(folder);
});

/**
 * Watcher for all new files being added
 * Kicks of the whole process
 */
fileWatcher.on('add', async path => {
  log(`File has been added`, `type`, `Info`, `file`, path, `timestamp`, new Date().toLocaleDateString('de-DE'));

  let meta = await readMetadata(path);
  log(`Read metadata of audio file`, `type`, `Info`, `file`, path, `extract`, JSON.stringify(meta).substr(0, 80) + '...', `length`, JSON.stringify(meta).length);
  
  log(`Requesting insertion of indexed audio file`, `type`, `Info`, `file`, path, `db`, url);
  await postTrackToAPI(meta);
});

/**
 * Watcher for file deletions
 */
fileWatcher.on('unlink', async path => {
  log(`File ${path} has been removed`, `file`, path, `time`, new Date().toLocaleDateString('de-DE'));
 
  log(`Requesting deletion of indexed audio file`, `file`, path, `db`, url);
  // API Server querys for full path on delete request
  await removeTrackFromAPI(path);
});

/**
 * Watcher for album deletions
 */
folderWatcher.on('unlinkDir', async path => {
  log(`File ${path} has been removed`, `file`, path, `time`, new Date().toLocaleDateString('de-DE'));
  
  log(`Requesting deletion of indexed audio file`, `file`, path, `db`, url);
  // API Server querys for full path on delete request
  await removeAlbumFromAPI(path);
});

/**
 * Requests creation of a new track
 * @param {*} data track data to post to the API
 */
async function postTrackToAPI(data) {
  const resp = await post(`${apiEndpoint}/demo/file`, data);
  if (resp && resp.status !== 200) {
    log(`Successfully posted track to API`, `type`, `Info`, `response`, resp);
  } else {
    log(`Received error status from API`, `type`, `Error`, `response`, resp);
  }
}

/**
 * Requests creation of a new album
 * @param {string} album album title
 */
async function postAlbumToAPI(album) {
  const resp = await post(`${apiEndpoint}/demo/folder`, {'album': album});
  if (resp && resp.status !== 200) {
    log(`Successfully posted album to API`, `type`, `Info`, `response`, resp);
  } else {
    log(`Received error status from API`, `type`, `Error`, `response`, resp);
  }
}

/**
 * Requests deletion of a previously added audio file
 * @param {string} path path of the audio file to query the DB with
 */
async function removeTrackFromAPI(path) {
  const resp = await del(`${apiEndpoint}/demo/file`, {'path': path});

  if (resp && resp.status !== 200) {
    log(`Successfully deleted track from API`, `type`, `Info`, `response`, resp);
  } else {
    log(`Received error status from API`, `type`, `Error`, `response`, resp);
  }
}

/**
 * Requests deletion of a previously added album
 * @param {*} path directory name that we need to delete
 */
async function removeAlbumFromAPI(path) {
  const resp = await del(`${apiEndpoint}/demo/folder`, {'path': path});

  if (resp && resp.status !== 200) {
    log(`Successfully deleted album from API`, `type`, `Info`, `response`, resp);
  } else {
    log(`Received error status from API`, `type`, `Error`, `response`, resp);
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
    const resp = fetch(ep, {
      mode: 'cors',
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    return resp;
  } catch (err) {
    log(`Received error response from backend`, `type`, `Error`, `response`, err);
  }
}

/**
 * Reads a newly added mp3 file for its metadata and returns an object with all relevant information
 * @param {string} path to new file 
 */
async function readMetadata(path){
  const src = await metadata.parseFile(path);

  return {
    "year": src.common.year,
    "track": src.common.track,
    "title": src.common.title,
    "artist": src.common.artist,
    "albumartist": src.common.albumartist,
    "genre": src.common.genre,
    "composer": src.common.composer,
    "comment": src.common.comment,
    "bpm": src.common.bpm,
    "type": src.format.container,
    "duration": src.format.duration,
    "lossless": src.format.lossless,
    "bitrate": src.format.bitrate,
    "cover": src.common.picture,
    "path": path, // full path of file INSIDE volume
    "filename": p.basename(path), // this gets us the last element of the array inline
    "namespace": p.basename(p.dirname(path)),
    "url": `${url.prefix}://${url.hostname}${p.sep}${url.ftpPrefix}${p.basename(p.dirname(path))}${p.sep}${p.basename(path)}` // this monster contains the final shareable url on the webserver
  }
}