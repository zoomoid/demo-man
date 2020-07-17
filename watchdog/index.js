const chokidar = require('chokidar');
const metadata = require('music-metadata');
const fetch = require('node-fetch');
const logger = require('@zoomoid/log');
const p = require('path');
const fs = require('fs');

/**
 * API Server endpoint to query
 */
const apiEndpoint = process.env.API_ENDPOINT || 'http://demo-api/api/v1/demo';

const url = JSON.parse(process.env.PUBLIC_PATH) || {
  prefix: 'https',
  hostname: 'files.zoomoid.de',
  dir: '',
};

if (!process.env.TOKEN) {
  logger.warn('No API token provided. Protected routes will not work properly.');
}

const token = process.env.TOKEN;

/**
 * Volume path to watch
 * 
 * General guidelines for using this watchdog: 
 * We listen to all changes in 2 layers of depth, i.e., we only get notified for changes to the relative root
 * and one layer below. This enables us to group tracks together to albums, as we can create directories and
 * watch for file changes inside the new directories.
 * Newly created directories are treated as albums being created.
 * Files created inside these directories are treated as tracks being created.
 * 
 * The same applies to deletion of said directories/files.
 * 
 * Hierarchy:
 * 
 * ./ (relative root; determined by "VOLUME")
 * |- namespace
 *    |- track1.mp3
 *    |- track2.mp3
 *    |- track3.mp3
 * |- namespace
 *    |- track1.mp3
 *    |- track2.mp3
 * |- namespace
 * 
 * This is a valid file tree for our example watchdog 
 */
const volume = process.env.VOLUME || '.';

/** FILE Watcher */
const fileWatcher = chokidar.watch(`${volume}/[a-zA-Z0-9]*/*.mp3`, {
  cwd: `${volume}`,
  ignoreInitial: true,
  persistent: true,
  atomic: true,
  usePolling: true,
  depth: 2,
  awaitWriteFinish: {
    stabilityThreshold: 3000,
    pollInterval: 1000,
  },
});

/** Directory Watcher */
const folderWatcher = chokidar.watch(`${volume}/`, {
  cwd: `${volume}`,
  ignored: [/(^|[/\\])\../, 'private-keys-v1.d'], // exclude some FileZilla bullshit directories
  ignoreInitial: true,
  persistent: true,
  atomic: true,
  usePolling: true,
  depth: 1,
});

logger.info('Watching directory', 'volume', volume);

/** 
 * Garbage collector
 * 
 * This file watcher removes any files and directories created in the process of SFTP handshakes by FileZilla
 */
const garbageCollector = chokidar.watch(['.cache', '.gnupg', 'private-keys-v1.d']);
garbageCollector.on('addDir', async (path) => {
  logger.info('Cleaning up trash directories', 'directory', path);
  fs.rmdir(path, { recursive: true }, (err) => {
    if (err) {
      logger.error('Error on rmdir w/ recursive option', 'error', err);
      return;
    }
    logger.info('Finish cleanup round', 'directory', path);
  });
});

/**
 * Awaits new files to be added and requests insertion into the namespace from the API server
 */
fileWatcher.on('add', async path => {
  try {
    logger.info('File added', 'file', path, 'timestamp', new Date().toLocaleString('de-DE'));
    const reducedFilename = path.replace(`${volume}/`, ''); // strips the volume mount prefix from the filename
    let track = await readMetadata(reducedFilename);
    await postTrackToAPI(track);
  } catch (err) {
    logger.error('Received error from API server', 'event', 'add', 'path', path, 'error', err);
    logger.info('Reverting changes to file system', 'path', path);
    fs.unlink(path, (err) => {
      logger.error('I/O Error on unlink. Exiting...', 'error', err);
      process.exit(1);
    });
  }
});

/**
 * Awaits directory addition and requests creation of a new namespace from the API server
 */
folderWatcher.on('addDir', async path => {
  try {
    if (path == `${volume}/`) {
      logger.info('Skipping docker volume mount event', 'directory', path);
      return;
    }
    logger.info('Directory added', 'directory', path, 'timestamp', new Date().toLocaleString('de-DE'));
    let namespace = p.basename(path);
    await postNamespaceToAPI(namespace);
  } catch (err) {
    logger.error('Received error from API server', 'event', 'addDir', 'path', path, 'error', err);
    logger.info('Reverting changes to file system', 'path', path);
    fs.unlink(path, (err) => {
      logger.error('I/O Error on unlink. Exiting...', 'error', err);
      process.exit(1);
    });
  }
});

/**
 * Watcher for file deletions
 */
fileWatcher.on('unlink', async path => {
  const reducedFilename = path.replace(`${volume}/`, ''); // strips the volume mount prefix from the filename
  logger.info('File removed', 'file', reducedFilename, 'time', new Date().toLocaleString('de-DE'));
  // API Server querys for full path on delete request
  try {
    await removeTrackFromAPI(reducedFilename);
  } catch (err) {
    logger.error('Received error from API server. Manual assessment required', 'event', 'unlink', 'path', path, 'error', err);
  }
});

/**
 * Watcher for album deletions
 */
folderWatcher.on('unlinkDir', async path => {
  const reducedFilename = path.replace(`${volume}/`, ''); // strips the volume mount prefix from the filename
  logger.info('Directory removed', 'directory', reducedFilename, 'time', new Date().toLocaleString('de-DE'));
  // API Server querys for full path on delete request
  try {
    await removeNamespaceFromAPI(reducedFilename);
  } catch (err) {
    logger.error('Received error from API server. Manual assessment required.', 'event', 'unlinkDir', 'error', err);
  }
});

/**
 * Requests creation of a new track
 * @param {*} data track data to post to the API
 */
async function postTrackToAPI(track) {
  logger.info('Adding track...', 'track', track.filename, 'endpoint', apiEndpoint);
  const resp = await post(`${apiEndpoint}/track`, { 'track': track });
  if (resp && resp.status == 200) {
    logger.info('Added track', 'track', track.filename, 'response', resp);
  } else {
    logger.error('Received error status from API', 'track', track.filename, 'level', 'postTrackToAPI', 'response', resp);
  }
}

/**
 * Requests creation of a new album
 * @param {string} album album title
 */
async function postNamespaceToAPI(ns) {
  logger.info('Adding namespace...', 'namespace', ns, 'endpoint', apiEndpoint);
  const resp = await post(`${apiEndpoint}/namespace`, { 'namespace': ns });
  if (resp && resp.status == 200) {
    logger.info('Added namespace', 'namespace', ns, 'response', resp);
  } else {
    logger.error('Received error status from API', 'namespace', ns, 'level', 'postNamespaceToAPI', 'response', resp);
  }
}

/**
 * Requests deletion of a previously added audio file
 * @param {string} path path of the audio file to query the DB with
 */
async function removeTrackFromAPI(path) {
  logger.info('Deleting track...', 'track', path, 'endpoint', apiEndpoint);
  const resp = await del(`${apiEndpoint}/track`, { 'path': path });
  if (resp && resp.status == 200) {
    logger.info('Deleted track', 'track', `${p.basename(path)}`, 'response', resp);
  } else {
    logger.error('Received error status from API', 'level', 'removeTrackFromAPI', 'response', resp);
  }
}

/**
 * Requests deletion of a previously added album
 * @param {*} path directory name that we need to delete
 */
async function removeNamespaceFromAPI(ns) {
  logger.info('Deleting namespace...', 'namespace', ns, 'endpoint', apiEndpoint);
  const resp = await del(`${apiEndpoint}/namespace`, { 'namespace': ns });
  if (resp && resp.status == 200) {
    logger.info('Deleted namespace', 'namespace', ns, 'response', resp);
  } else {
    logger.error('Received error status from API', 'level', 'removeNamespaceFromAPI', 'response', resp);
  }
}

/**
 * Shorthand function for HTTP POST requests
 * @param {string} ep Endpoint URL
 * @param {*} data data to post
 */
async function post(ep, data) {
  return __request('POST', ep, data);
}

/**
 * Shorthand function for HTTP DELETE request
 * @param {string} ep endpoint url
 * @param {*} data data to delete
 */
async function del(ep, data) {
  return __request('DELETE', ep, data);
}

/**
 * Your generic http wrapper using node-fetch
 * @param {string} method http method
 * @param {string} ep endpoint url
 * @param {*} data data object to be posted
 */
async function __request(method, ep, data) {
  try {
    if (!process.env.DRY_RUN) {
      data.token = token;
      const resp = await fetch(ep, {
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
      logger.warn('Dry run! Not sending request to API server', 'endpoint', `${ep}`, 'data', data);
      return {
        'success': true,
        'note': 'dry_run',
        'data': data,
      };
    }
  } catch (err) {
    logger.error('Received error from API server', 'level', '__request', 'response', err, 'endpoint', `${ep}`);
  }
}

/**
 * Reads a newly added mp3 file for its metadata and returns an object with all relevant information
 * @param {string} path to new file 
 */
async function readMetadata(path) {
  console.log(path);
  try {
    logger.info('Reading IDv3 off of audio file', 'path', path);
    const src = await metadata.parseFile(p.join(volume, path));
    logger.info('Parsed audio file metadata', 'dirname', p.dirname(path), 'filename', p.basename(path));
    let mimeType = '';
    let abspath = '';
    let cover = {};
    if (src.common.picture) {
      mimeType = src.common.picture[0].format;
      abspath = p.join(volume, p.dirname(path), `cover.${mimeType.replace('image/', '')}`);
      logger.info('Writing cover to file', 'filename', abspath, 'mimeType', mimeType);
      fs.writeFileSync(abspath, src.common.picture[0].data);
      cover = {
        'mimeType': mimeType,
        'public_url': `${url.prefix}://${url.hostname}/${url.dir}${p.basename(p.dirname(path))}${p.sep}cover.${mimeType.replace('image/', '')}`
      };
    } else {
      logger.warn('Audio file metadata has no cover yet, omitting for now', 'path', `${path}`);
    }
    logger.info('Read metadata off of audio file', 'path', path);
    return {
      'year': src.common.year,
      'no': src.common.track.no,
      'title': src.common.title,
      'artist': src.common.artist,
      'albumartist': src.common.albumartist,
      'album': src.common.album,
      'genre': src.common.genre,
      'composer': src.common.composer,
      'comment': src.common.comment,
      'bpm': src.common.bpm,
      'type': src.format.container,
      'duration': src.format.duration,
      'lossless': src.format.lossless,
      'bitrate': src.format.bitrate,
      'cover': cover,
      'path': path, // full path of file INSIDE volume, this can be sent to the waveman
      'filename': p.basename(path),
      'namespace': p.basename(p.dirname(path)),
      'mp3': `${url.prefix}://${url.hostname}/${url.dir}${p.basename(p.dirname(path))}${p.sep}${p.basename(path)}`
    };
  } catch (err) {
    console.log(err);
    logger.error('Error while parsing audio metadata', 'error', err, 'file', path, 'level', 'readMetadata');
  }
}