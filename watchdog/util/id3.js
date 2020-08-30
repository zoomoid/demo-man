const metadata = require("music-metadata");
const logger = require("@zoomoid/log").v2;
const path = require("path");
const fs = require("fs");
const { volume, url } = require("../constants");

function writeCover(src, p) {
  try {
    if (src.common.picture) {
      let mimeType = src.common.picture[0].format;
      let abspath = path.join(
        volume,
        path.dirname(p),
        `cover.${mimeType.replace("image/", "")}`
      );
      logger.info("Writing cover to file", {
        cover: abspath,
        mimeType: mimeType,
      });
      fs.writeFileSync(abspath, src.common.picture[0].data);
      return {
        mimeType: mimeType,
        public_url: `${url.prefix}://${url.hostname}/${url.dir}${path.basename(
          path.dirname(p)
        )}${path.sep}cover.${mimeType.replace("image/", "")}`,
      };
    } else {
      logger.warn("Audio file metadata has no cover yet, omitting for now", {
        path: `${p}`,
      });
      return {};
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * Reads a newly added mp3 file for its metadata and returns an object with all relevant information
 * @param {string} path to new file
 */
function readMetadata(p) {
  return new Promise((resolve, reject) => {
    logger.info("Reading IDv3 off of audio file", { path: p });
    metadata
      .parseFile(path.join(volume, p))
      .then((src) => {
        logger.info("Parsed audio metadata", {
          dirname: path.dirname(p),
          filename: path.basename(p),
        });
        let cover = writeCover(src, p);
        resolve({
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
          path: p,
          filename: path.basename(p),
          namespace: path.basename(path.dirname(p)),
          mp3: `${url.prefix}://${url.hostname}/${url.dir}${path.basename(
            path.dirname(p)
          )}${path.sep}${path.basename(p)}`,
        });
      })
      .catch((err) => {
        logger.error("Error while parsing audio metadata", {
          error: err,
          file: p,
          in: "readMetadata",
        });
        reject(err);
      });
  });
}

module.exports = readMetadata;
