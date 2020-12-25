/**
 * Creates a DNS conformant string for any given name, i.e.,
 * replace all spaces
 * @param {string} name name to convert
 */
const dnsName = function (name = "") {
  return name
    .toLowerCase() // convert to lowercase
    .replace(/\s/g, "-") // replace spaces with -
    .replace(/_/g, "-") // replace other separation characters
    .replace(/\./g, "-") // replace other separation characters
    .replace(/[^a-z0-9-]/g, "") // remove all non-lowercase letters or non-numbers
    .substr(0, 64); // limit length to maximum of 64 chars
};

// /**
//  * Converts a camleCase name to snake_case
//  * @param {string} name name in CamelCase to convert to snake_case
//  */
// const camelToSnakeCase = function (name) {
//   return name.replace(/([A-Z])/g, /_$1/).toLowerCase();
// };

// /**
//  * Converts a camleCase name to kebab-case
//  * @param {string} name name in CamelCase to convert to kebab-case
//  */
// const camelToKebabCase = function (name) {
//   return name.replace(/([A-Z])/g, /-$1/).toLowerCase();
// };

module.exports = {
  dnsName,
  // camelToSnakeCase,
  // camelToKebabCase,
};
