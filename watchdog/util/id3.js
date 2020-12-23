const metadata = require("music-metadata");
const logger = require("@occloxium/log").v2;
const path = require("path");
const fs = require("fs");
const { volume, url } = require("../constants");

/**
 * Constructs an FQDN URL to a given resource closure
 * @param {() => string} closure
 */
function absolutePath(closure) {
  return `${url.prefix}://${url.hostname}/${url.dir}${closure()}`;
}

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
      const localImagePath = path.join(
        path.basename(path.dirname(p)),
        `cover.${mimeType.replace("image/", "")}`
      );
      return {
        mimeType: mimeType,
        publicUrl: absolutePath(() => localImagePath),
        localUrl: localImagePath,
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
          metadata: {
            namespace: path.basename(path.dirname(p)),
            name: src.common.title,
          },
          track: {
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
            duration: src.format.duration,
            sr: src.format.sampleRate,
            bitrate: src.format.bitrate,
            cover: cover,
            path: p,
            filename: path.basename(p),
            mp3: absolutePath(() =>
              path.join(path.basename(path.dirname(p)), path.basename(p))
            ),
          },
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
