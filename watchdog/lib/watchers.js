const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs").promises;
const yaml = require("js-yaml");
const { metadataTemplate } = require("../constants");
const { track, namespace, metadata } = require("./requests");
const { id3, logger } = require("../util");

/**
 * Builder for FSWatchers
 * @param {string} volume base volume path
 */
const buildWatchers = (volume) => {
  const trackWatcher = chokidar.watch(`${volume}/[\\w-]*/*.mp3`, {
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

  const namespaceWatcher = chokidar.watch(`${volume}/`, {
    cwd: `${volume}`,
    ignored: [/(^|[/\\])\../, "private-keys-v1.d"], // exclude some FileZilla intermediary directories
    ignoreInitial: true,
    persistent: true,
    atomic: true,
    usePolling: true,
    depth: 1,
  });

  const metadataWatcherOptions = {
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
  };

  const m = {
    loaders: {
      json: (p) =>
        JSON.parse(
          fs.readFileSync(path.join(volume, p), { encoding: "utf-8" })
        ),
      yaml: (p) =>
        yaml.safeLoad(
          fs.readFileSync(path.join(volume, p), { encoding: "utf-8" })
        ),
    },
    add: (loader, p) => {
      const config = loader(p);
      metadata.change(config, p, path.dirname(p)).catch((err) => {
        logger.debug(err);
      });
    },
    remove: (p) => {
      metadata.change({}, p, path.dirname(p)).catch((err) => {
        logger.debug(err);
      });
    },
  };

  const metadataWatcherJSON = chokidar.watch(
    `${volume}/[\\w-]*/metadata.json`,
    metadataWatcherOptions
  );
  const metadataWatcherYAML = chokidar.watch(
    `${volume}/[\\w-]*/metadata.yaml`,
    metadataWatcherOptions
  );

  const gcWatcher = chokidar.watch([".cache", ".gnupg", "private-keys-v1.d"], {
    cwd: `${volume}`,
  });
  return {
    watchers: {
      namespace: namespaceWatcher,
      track: trackWatcher,
      metadata: {
        json: metadataWatcherJSON,
        yaml: metadataWatcherYAML,
      },
      gc: gcWatcher,
    },
    options: m,
  };
};

/**
 * Writes a metadata.yaml for a namespace to a volume
 * @param {string} volume local data volume
 * @param {string} namespace namespace for metadata
 */
const writeMetadata = (volume, namespace) => {
  fs.writeFileSync(
    path.join(volume, namespace, "metadata.yaml"),
    metadataTemplate(namespace)
  );
};

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
 * 
 * @param {string} volume global data volume path
 * @returns set of watchers with Event Listeners subscribed to the FSWatchers
 */
const runWatchers = function (volume) {
  /** mp3 watcher */
  const { watchers, options } = buildWatchers(volume);
  watchers.track
    .on("add", async (path) => {
      logger.info("File added: %s", path);
      const reducedFilename = path.replace(`${volume}/`, ""); // strips the volume mount prefix from the filename
      id3(reducedFilename)
        .then((t) => track.add(t))
        .catch(() => {
          logger.info("Reverting changes to file system: %s", path);
          fs.rm(path).catch((err) => {
            logger.error("I/O Error on rm. Exiting...");
            logger.debug(err);
            process.exit(1);
          });
        });
    })
    .on("unlink", (path) => {
      const reducedFilename = path.replace(`${volume}/`, "");
      logger.info("File removed: %s", reducedFilename);
      track.remove(reducedFilename).catch((err) => {
        logger.debug(err);
      });
    });

  /** namespace watcher */
  watchers.namespace
    .on("addDir", (p) => {
      if (p === `${volume}/`) {
        logger.info("Skipping docker volume mount event", { directory: p });
        return;
      }
      logger.info("Directory added", {
        directory: p,
      });
      let directory = path.basename(p);
      writeMetadata(volume, directory);
      namespace.add(directory).catch(() => {
        logger.info("Reverting changes to file system", { path: p });
        fs.rm(p, { recursive: true }).catch((err) => {
          logger.error("I/O Error on unlink. Exiting...");
          logger.debug(err);
          process.exit(1);
        });
      });
    })
    .on("unlinkDir", async (p) => {
      const reducedFilename = p.replace(`${volume}/`, "");
      logger.info("Directory removed", {
        directory: reducedFilename,
      });
      await namespace.remove(reducedFilename).catch((err) => {
        logger.debug(err);
      });
    });

  /**
   * metadata watchers
   * Supports both json and yaml files
   */
  watchers.metadata.json
    .on("add", options.add.bind(null, "add", options.loaders.json))
    .on("change", options.add.bind(null, "change", options.loaders.json))
    .on("unlink", options.remove);

  watchers.metadata.yaml
    .on("add", options.add.bind(null, "add", options.loaders.yaml))
    .on("change", options.add.bind(null, "change", options.loaders.yaml))
    .on("unlink", options.remove);

  /**
   * Garbage collector removes any files and directories created in the process of SFTP handshakes by FileZilla
   */
  watchers.gc.on("addDir", (path) => {
    logger.info("Cleaning up trash directories", { directory: path });
    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) {
        logger.error("Error on rmdir w/ recursive option", { error: err });
        return;
      }
      logger.info("Finish GC cleanup round", { directory: path });
    });
  });

  return {
    namespace: watchers.namespace,
    track: watchers.track,
    metadata: watchers.metadata,
    gc: watchers.gc,
  };
};

module.exports = {
  runWatchers,
  buildWatchers
};