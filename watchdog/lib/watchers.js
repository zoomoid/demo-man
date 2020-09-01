const chokidar = require("chokidar");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const logger = require("@zoomoid/log").v2;
const { volume, metadataTemplate } = require("../constants");
const { track, namespace, metadata } = require("./requests");
const { id3 } = require("../util");
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
 * This is a valid file tree for our example watchdog */

module.exports = function () {
  /** mp3 watcher */
  chokidar
    .watch(`${volume}/[a-zA-Z0-9]*/*.mp3`, {
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
    })
    .on("add", async (path) => {
      logger.info("File added", {
        file: path,
        timestamp: new Date().toLocaleString("de-DE"),
      });
      const reducedFilename = path.replace(`${volume}/`, ""); // strips the volume mount prefix from the filename
      id3(reducedFilename)
        .then((t) => track.add(t))
        .catch((err) => {
          logger.error("Received error from API server", {
            on: "add",
            path: path,
            error: err,
          });
          logger.info("Reverting changes to file system", { path: path });
          fs.unlink(path, (err) => {
            logger.error("I/O Error on unlink. Exiting...", { error: err });
            process.exit(1);
          });
        });
    })
    .on("unlink", (path) => {
      const reducedFilename = path.replace(`${volume}/`, "");
      logger.info("File removed", {
        file: reducedFilename,
        time: new Date().toLocaleString("de-DE"),
      });
      track.remove(reducedFilename).catch((err) => {
        logger.error("Received error from API server. USER ACTION REQUIRED!", {
          on: "unlink",
          path: path,
          error: err,
        });
      });
    });

  /** namespace watcher */
  chokidar
    .watch(`${volume}/`, {
      cwd: `${volume}`,
      ignored: [/(^|[/\\])\../, "private-keys-v1.d"], // exclude some FileZilla bullshit directories
      ignoreInitial: true,
      persistent: true,
      atomic: true,
      usePolling: true,
      depth: 1,
    })
    .on("addDir", (p) => {
      if (p == `${volume}/`) {
        logger.info("Skipping docker volume mount event", { directory: p });
        return;
      }
      logger.info("Directory added", {
        directory: p,
        timestamp: new Date().toLocaleString("de-DE"),
      });
      let n = path.basename(p);
      // creates a default metadata.yaml file.
      // May later be overridden by a fresh one or replaced by a metadata.json file
      fs.writeFileSync(path.join(volume, n, "metadata.yaml"), metadataTemplate(n));
      namespace.add(n).catch((err) => {
        logger.error("Received error from API server", {
          on: "addDir",
          path: p,
          error: err,
        });
        logger.info("Reverting changes to file system", { path: p });
        fs.unlink(p, (err) => {
          logger.error("I/O Error on unlink. Exiting...", { error: err });
          process.exit(1);
        });
      });
    })
    .on("unlinkDir", async (p) => {
      const reducedFilename = p.replace(`${volume}/`, "");
      logger.info("Directory removed", {
        directory: reducedFilename,
        time: new Date().toLocaleString("de-DE"),
      });
      await namespace.remove(reducedFilename).catch((err) => {
        logger.error("Received error from API server. USER ACTION REQUIRED!", {
          on: "unlinkDir",
          error: err,
        });
      });
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
    options: {
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
    },
    loaders: {
      json: (p) => require(path.join(volume, p)),
      yaml: (p) =>
        yaml.safeLoad(
          fs.readFileSync(path.join(volume, p), { encoding: "utf-8" })
        ),
    },
    add: (event, loader, p) => {
      const config = loader(p);
      metadata.change(config, p, path.dirname(p)).catch((err) => {
        logger.error("Failed to update namespace metadata", {
          on: event,
          error: err,
          path: p,
        });
      });
    },
    remove: (p) => {
      metadata.change({}, p, path.dirname(p)).catch((err) => {
        logger.error("Failed to update namespace metadata", {
          on: "unlink",
          error: err,
          path: p,
        });
      });
    },
  };

  /**
   * metadata watchers
   * Supports both json and yaml files
   */
  chokidar
    .watch(`${volume}/[A-Za-z0-9]*/metadata.json`, m.options)
    .on("add", m.add.bind(null, "add", m.loaders.json))
    .on("change", m.add.bind(null, "change", m.loaders.json))
    .on("unlink", m.remove);

  chokidar
    .watch(`${volume}/[A-Za-z0-9]*/metadata.yaml`, metadataWatcherOptions)
    .on("add", m.add.bind(null, "add", m.loaders.yaml))
    .on("change", m.add.bind(null, "change", m.loaders.yaml))
    .on("unlink", m.remove);

  /**
   * Garbage collector removes any files and directories created in the process of SFTP handshakes by FileZilla
   */
  chokidar
    .watch([".cache", ".gnupg", "private-keys-v1.d"], { cwd: `${volume}` })
    .on("addDir", (path) => {
      logger.info("Cleaning up trash directories", { directory: path });
      fs.rmdir(path, { recursive: true }, (err) => {
        if (err) {
          logger.error("Error on rmdir w/ recursive option", { error: err });
          return;
        }
        logger.info("Finish cleanup round", { directory: path });
      });
    });
};
