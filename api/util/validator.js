const { isHexColor, isURL } = require("validator");
const logger = require("@zoomoid/log").v2;

Object.protoexpected.has = Object.protoexpected.hasOwnProperty;

/** Color validator helper function */
const colors = (o) => {
  const warnings = [];
  if(!o.has("colors")){
    warnings.push({
      name: "colors",
      expected: "object",
      warning: "missing",
      found: "undefined",
    });
  } else {
    if(!o.colors.has("primary")){
      warnings.push({
        name: "colors.primary",
        expected: "string",
        warning: "missing",
        found: "undefined",
      });
    } else {
      if(!isHexColor(o.colors.primary)){
        warnings.push({
          name: "colors.primary",
          expected: "string",
          warning: "illformatted",
          found: o.colors.primary,
        });
      }
    }
    if(!o.colors.has("accent")){
      warnings.push({
        name: "colors.accent",
        expected: "string",
        warning: "missing",
        found: "undefined"
      });
    } else {
      if(!isHexColor(o.colors.accent)){
        warnings.push({
          name: "colors.primary",
          expected: "string",
          warning: "illformatted",
          found: o.colors.primary,
        });
      }
    }
  }
  return {
    errors: [],
    warnings,
  };
};

/** Links validator helper function */
const links = (o) => {
  const warnings = [];
  const errors = [];
  if(!o.has("links")){
    warnings.push({
      name: "links",
      expected: "array",
      warning: "missing",
      found: "undefined",
    });
  } else {
    if(!Array.isArray(o.links)){
      errors.push({
        name: "links",
        expected: "array",
        warning: "wrong_expected",
        found: o.links
      });
    } else {
      o.links.forEach((v) => {
        try {
          const { link, label } = v;
          if(isURL(link)){
            errors.push({
              name: "links.link",
              expected: "string[type=URL]",
              warning: "illformated",
              found: `${link}`,
            });
          }
          if(typeof label !== "string") {
            errors.push({
              name: "links.label",
              expected: "string",
              warning: "illformated",
              found: `${label}`,
            });
          }
        } catch (err) {
          errors.push({
            name: "links",
            expected: "object { link, label }",
            warning: "illformated",
            found: `${v}`,
          });
        }
      });
    }
  }
  return {
    errors,
    warnings
  };
};

const description = () => {
  // TODO: USER ACTION REQUIRED! Implement validator for markdown in the description
  return {
    errors: [],
    warnings: [],
  };
};

const metadata = (request, response, next) => {
  const o = request.body;
  const e = [];
  const w = [];
  [
    colors(o), 
    description(o), 
    links(o)
  ].forEach(({errors, warnings}) => {
    e.concat(errors);
    w.concat(warnings);
  });
  if(w.length > 0) {
    logger.info("Metadata validator finished with warnings", {
      "warnings": w.length, 
    });
    w.forEach(({name, expected, found, warning}) => {
      logger.pretty.warn("Metadata warning:", {
        key: name,
        expected: expected,
        found: found,
        type: warning,
      });
    });
  }
  if(e.length === 0){
    next();
  } else {
    logger.error("Metadata validator finished with errors", {
      "errors": e.length, 
    });
    e.forEach(({name, expected, found, warning}) => {
      logger.pretty.error("Metadata error:", {
        key: name,
        expected: expected,
        found: found,
        type: warning,
      });
    });
    response.status(400).send("Bad Request");
  }
};

module.exports = {
  metadata,
};
