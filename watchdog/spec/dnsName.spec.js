const { describe, it } = require("mocha");
const { expect } = require("chai");

const { dnsName } = require("../util/dnsName");

describe("dnsName", function () {
  it("convert spaces to dashes", function () {
    expect(dnsName("shades of yellow")).to.be.equal("shades-of-yellow");
    expect(dnsName("shades of-yellow")).to.be.equal("shades-of-yellow");
  });
  it("convert underscores to dashes", function () {
    expect(dnsName("shades_of_yellow")).to.be.equal("shades-of-yellow");
    expect(dnsName("shades_of-yellow")).to.be.equal("shades-of-yellow");
  });
  it("convert dots to dashes", function () {
    expect(dnsName("shades.of.yellow")).to.be.equal("shades-of-yellow");
    expect(dnsName("shades.of-yellow")).to.be.equal("shades-of-yellow");
  });
  it("convert to lowercase", function () {
    expect(dnsName("Shades Of Yellow")).to.be.equal("shades-of-yellow");
    expect(dnsName("ShadesOfYellow")).to.be.equal("shadesofyellow");
  });
  it("remove non-alphabetic characters", function() {
    expect(dnsName("ShädesÖfYellöw")).to.not.contain("äÄöÖüÜ");
  });
  it("trim string length to max 64", function () {
    expect(dnsName("a".repeat(128))).to.be.of.length(64);
    expect(dnsName("a".repeat(0))).to.be.of.length(0);
    expect(dnsName("a".repeat(64))).to.be.of.length(64);
    expect(dnsName("a".repeat(65))).to.be.of.length(64);
  });
});
