const metadata = require("music-metadata");
const logger = require("./logger");
const {dnsName} = require("./dnsName");
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

/**
 * Writes a cover image for a Track to the namespace
 * @param {{metadata: Object, track: Object}} resource track resource
 * @param {metadata.IPicture[]} cover cover images attached to file
 */
function writeCover({ metadata, track }, cover) {
  try {
    if (cover) {
      let format = cover[0].format.replace("image/", "");
      let abspath = path.join(volume, track.file.directory, `cover.${format}`);
      logger.verbose("Writing cover to file for");
      fs.writeFileSync(abspath, cover[0].data);
      const localImagePath = path.join(track.file.directory, `cover.${format}`);
      return {
        mimeType: `image/${format}`,
        publicUrl: absolutePath(() => localImagePath),
        localUrl: localImagePath,
        filename: `cover.${format}`,
      };
    } else {
      logger.warn(`Track/${metadata.name} has no cover yet!`);
      return {};
    }
  } catch (err) {
    logger.error("Failed to write cover to file", { path: track.file.path });
    logger.debug(err);
  }
}

/**
 * Reads a newly added mp3 file for its metadata and returns an object with all relevant information
 * @param {string} path to new file
 */
function readMetadata(p) {
  return new Promise((resolve, reject) => {
    logger.verbose("Extracting IDv3 from new Track", { path: p });
    metadata
      .parseFile(path.join(volume, p))
      .then((src) => {
        const directory = path.basename(path.dirname(p));
        const file = path.basename(p);
        const resource = {
          metadata: {
            namespace: dnsName(directory),
            name: dnsName(src.common.title),
          },
          track: {
            general: {
              title: src.common.title,
              artist: src.common.artist,
              albumartist: src.common.albumartist,
              album: src.common.album,
              year: src.common.year,
              no: src.common.track.no,
              genre: src.common.genre,
              composer: src.common.composer,
              comment: src.common.comment,
              bpm: src.common.bpm,
              duration: src.format.duration,
            },
            file: {
              sr: src.format.sampleRate,
              bitrate: src.format.bitrate,
              path: p,
              directory: directory,
              name: file,
              mp3: absolutePath(() => path.join(directory, file)),
            },
            cover: {},
          },
        };
        logger.verbose(
          `Extracted id3 data from new Track/${resource.metadata.name}`
        );
        resource.track.cover = writeCover(resource, src.common.picture);
        resolve(resource);
      })
      .catch((err) => {
        logger.error("Failed to parse id3 metadata for Track", { file: p });
        logger.debug(err);
        reject(err);
      });
  });
}

module.exports = readMetadata;
