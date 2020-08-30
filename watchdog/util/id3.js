const metadata = require("music-metadata");
const logger = require("@zoomoid/log").v2;
const path = require("path");
const fs = require("fs");
const { volume, url } = require("../constants");

/**
 * Reads a newly added mp3 file for its metadata and returns an object with all relevant information
 * @param {string} path to new file
 */
async function readMetadata(p) {
  console.log(path);
  try {
    logger.info("Reading IDv3 off of audio file", { path: p });
    const src = await metadata.parseFile(path.join(volume, p));
    logger.info("Parsed audio file metadata", {
      dirname: path.dirname(path),
      filename: path.basename(path),
    });
    let mimeType = "";
    let abspath = "";
    let cover = {};
    if (src.common.picture) {
      mimeType = src.common.picture[0].format;
      abspath = p.join(
        volume,
        p.dirname(path),
        `cover.${mimeType.replace("image/", "")}`
      );
      logger.info("Writing cover to file", {
        cover: abspath,
        mimeType: mimeType,
      });
      fs.writeFileSync(abspath, src.common.picture[0].data);
      cover = {
        mimeType: mimeType,
        public_url: `${url.prefix}://${url.hostname}/${url.dir}${p.basename(
          p.dirname(path)
        )}${p.sep}cover.${mimeType.replace("image/", "")}`,
      };
    } else {
      logger.warn("Audio file metadata has no cover yet, omitting for now", {
        path: `${path}`,
      });
    }
    logger.info("Read metadata off of audio file", { path: path });
    return {
      year: src.common.year,
      no: src.common.track.no,
      title: src.common.title,
      artist: src.common.artist,
      albumartist: src.common.albumartist,
      album: src.common.album,
      genre: src.common.genre,
      composer: src.common.composer,
      comment: src.common.comment,
      bpm: src.common.bpm,
      type: src.format.container,
      duration: src.format.duration,
      sr: src.format.sampleRate,
      lossless: src.format.lossless,
      bitrate: src.format.bitrate,
      cover: cover,
      path: path,
      filename: p.basename(path),
      namespace: p.basename(p.dirname(path)),
      mp3: `${url.prefix}://${url.hostname}/${url.dir}${p.basename(
        p.dirname(path)
      )}${p.sep}${p.basename(path)}`,
    };
  } catch (err) {
    logger.error("Error while parsing audio metadata", {
      error: err,
      file: path,
      in: "readMetadata",
    });
  }
}

module.exports = readMetadata;
