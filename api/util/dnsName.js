/**
 * Creates a DNS conformant string for any given name, i.e.,
 * replace all spaces
 * @param {string} name name to convert
 */
module.exports = function dnsName(name = "") {
  return name
    .toLowerCase() // convert to lowercase
    .replace(" ", "-") // replace spaces with -
    .replace("_", "-") // replace other separation characters
    .replace(/[^a-z0-9]/, "") // remove all non-lowercase letters or non-numbers
    .substr(0, 63); // limit length to maximum of 64 chars
};
