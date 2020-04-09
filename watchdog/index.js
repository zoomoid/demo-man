import chokidar from 'chokidar';
import * as metadata from 'music-metadata';
import fetch from 'node-fetch'; 
import { log } from './util';

const volume = process.env.VOLUME || './files';
const watcher = chokidar.watch(`${volume}`, {persistent: true, atomic: true});


const readMetadata = async function(filename){
  const src = await metadata.parseFile(filename);

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
  }
}

watcher.on('add', async path => {
  log(`File has been added`, `type`, `Info`, `file`, path, `timestamp`, (new Date()).toLocaleDateString('de-DE'));

  let meta = await readMetadata(path);
  meta = JSON.stringify(meta);
  log(`Read metadata of audio file`, `type`, `Info`, `file`, path, `extract`, meta.substr(0, 200) + '...', `length`, meta.length, `timestamp`, (new Date()).toLocaleDateString('de-DE'));

  log(`Requesting insertion of indexed audio file`, `type`, `Info`, `file`, path, `db`, url);

  try {
    const resp = await fetch(`http://zoomoid-music/demo`, {
      mode: 'cors',
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: meta,
    });
    if ( resp.status !== 200 ){
      log(`Successfully posted metadata to backend`, `type`, `Info`, `response`, resp);
    } else {
      log(`Received error status from backend`, `type`, `Error`, `response`, resp);
    }
  } catch (err) {
    log(`Received error response from backend`, `type`, `Error`, `response`, err);
  }
});

watcher.on('unlink', async path => {
  log(`File ${path} has been removed`, `file`, path, `time`, (new Date()).toLocaleDateString('de-DE'));
  log(`Requesting deletion of indexed audio file`, `file`, path, `db`, url);
});


