const { describe, it, after } = require("mocha");
const { expect } = require("chai");
const fs = require("fs");
const { buildWatchers } = require("../lib/watchers");

const watcherFactory = () => {
  return buildWatchers("./data");
};

describe("Namespace watcher test", function () {
  it("Valid namespace (1)", function (done) {
    const w = watcherFactory();
    const p = "voyager";
    w.namespace.on("addDir", function (createdPath) {
      expect(createdPath).to.contain(p);
      done();
    });
    fs.mkdirSync(p);
  });
  it("Valid namespace (2)", function (done) {
    const w = watcherFactory();
    const p = "shades-of-yellow";
    w.namespace.on("addDir", function (createdPath) {
      expect(createdPath).to.contain(p);
      done();
    });
    fs.mkdirSync(p);
  });
  it("Valid namespace (3)", function (done) {
    const w = watcherFactory();
    const p = "shades_of_yellow";
    w.namespace.on("addDir", function (createdPath) {
      expect(createdPath).to.contain(p);
      done();
    });
    fs.mkdirSync(p);
  });
  it("Valid namespace (4)", function (done) {
    const w = watcherFactory();
    const p = "Voyager";
    w.namespace.on("addDir", function (createdPath) {
      expect(createdPath).to.contain(p);
      done();
    });
    fs.mkdirSync(p);
  });
  it("Invalid namespace (1)", function (done) {
    const w = watcherFactory();
    const p = "Shades Of Yellow";
    w.namespace.on("addDir", function () {
      done(false);
    });
    // Should not be picked up by the watcher
    fs.mkdirSync(p);
    this.timeout(2000); // should be picked up by the watcher in less time if correct
    done();
  });
  it("Invalid namespace (2)", function (done) {
    const w = watcherFactory();
    const p = ".shades-of-yellow";
    w.namespace.on("addDir", function () {
      done(false);
    });
    // Should not be picked up by the watcher
    fs.mkdirSync(p);
    this.timeout(2000); // should be picked up by the watcher in less time if correct
    done();
  });
  after(function () {
    fs.rmSync("./data", {
      recursive: true,
    });
  });
});

describe("Track watcher test", () => {});

describe("Metadata watcher test", () => {});

describe("GC watcher test", () => {});
