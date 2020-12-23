/**
 * Pluralizes (or not) a given resource subject
 * @param {string} singular subject singular
 * @param {number} quantity quantity of resources
 */
module.exports = function pluralize(resourceSingular, quantity){
  if(quantity === 1){
    return resourceSingular;
  } else {
    return resourceSingular + "s";
  }
};