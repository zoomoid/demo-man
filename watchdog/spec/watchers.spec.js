const { describe, it, after, before } = require("mocha");
const { expect } = require("chai");
const fs = require("fs");
const { buildWatchers } = require("../lib/watchers");

const watcherFactory = () => {
  return buildWatchers("/git/web/demo-man/watchdog/dist/").watchers;
};

describe("Namespace watcher test", function () {
  this.timeout(6000);
  before(function (done) {
    try {
      fs.mkdirSync("./dist/");
      done();
    } catch (err) {
      done(err);
    }
  });
  it("Valid namespace (1)", function (done) {
    const w = watcherFactory();
    const p = "voyager";
    w.namespace.on("addDir", function (createdPath) {
      expect(createdPath).to.contain(p);
      done();
    });
    fs.mkdirSync("./dist/" + p);
    setTimeout(() => done(new Error("FSWatcher did not fire, when it should have")), 5000);
  });
  // it("Valid namespace (2)", function (done) {
  //   const w = watcherFactory();
  //   const p = "shades-of-yellow";
  //   w.namespace.on("addDir", function (createdPath) {
  //     expect(createdPath).to.contain(p);
  //     done();
  //   });
  //   fs.mkdirSync("./dist/" + p);
  //   setTimeout(() => done(new Error("FSWatcher did not fire, when it should have")), 5000);
  // });
  // it("Valid namespace (3)", function (done) {
  //   const w = watcherFactory();
  //   const p = "shades_of_yellow";
  //   w.namespace.on("addDir", function (createdPath) {
  //     expect(createdPath).to.contain(p);
  //     done();
  //   });
  //   fs.mkdirSync("./dist/" + p);
  //   setTimeout(() => done(new Error("FSWatcher did not fire, when it should have")), 5000);
  // });
  // it("Valid namespace (4)", function (done) {
  //   const w = watcherFactory();
  //   const p = "Voyager";
  //   w.namespace.on("addDir", function (createdPath) {
  //     expect(createdPath).to.contain(p);
  //     done();
  //   });
  //   fs.mkdirSync("./dist/" + p);
  //   setTimeout(() => done(new Error("FSWatcher did not fire, when it should have")), 5000);
  // });
  // it("Invalid namespace (1)", function (done) {
  //   const w = watcherFactory();
  //   const p = "Shades Of Yellow";
  //   w.namespace.on("addDir", function () {
  //     done(false);
  //   });
  //   // Should not be picked up by the watcher
  //   fs.mkdirSync("./dist/" + p);
  //   setTimeout(() => done(), 2000);
  // });
  // it("Invalid namespace (2)", function (done) {
  //   const w = watcherFactory();
  //   const p = ".shades-of-yellow";
  //   w.namespace.on("addDir", function () {
  //     done(false);
  //   });
  //   // Should not be picked up by the watcher
  //   fs.mkdirSync("./dist/" + p);
  //   setTimeout(() => done(), 2000);
  // });
  after(function (done) {
    fs.rmSync("./dist", {
      recursive: true,
    });
    done();
  });
});

describe("Track watcher test", () => {});

describe("Metadata watcher test", () => {});

describe("GC watcher test", () => {});
