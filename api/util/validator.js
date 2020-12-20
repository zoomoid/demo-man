const { isHexColor, isURL, isAlphanumeric } = require("validator");
const logger = require("./logger");


/** Color validator helper function */
const colors = (o) => {
  const warnings = [];
  if (!o["colors"]) {
    warnings.push({
      name: "colors",
      expected: "object",
      warning: "missing",
      found: "undefined",
    });
  } else {
    if (!o.colors["primary"]) {
      warnings.push({
        name: "colors.primary",
        expected: "string",
        warning: "missing",
        found: "undefined",
      });
    } else {
      if (!isHexColor(o.colors.primary)) {
        warnings.push({
          name: "colors.primary",
          expected: "string",
          warning: "illformatted",
          found: o.colors.primary,
        });
      }
    }
    if (!o.colors["accent"]) {
      warnings.push({
        name: "colors.accent",
        expected: "string",
        warning: "missing",
        found: "undefined",
      });
    } else {
      if (!isHexColor(o.colors.accent)) {
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

const title = (o) => {
  return {
    warings: [],
    errors: [isAlphanumeric(o.name || "", "de-DE")],
  };
};

/** Links validator helper function */
const links = (o) => {
  const warnings = [];
  const errors = [];
  if (!o["links"]) {
    warnings.push({
      name: "links",
      expected: "array",
      warning: "missing",
      found: "undefined",
    });
  } else {
    if (!Array.isArray(o.links)) {
      errors.push({
        name: "links",
        expected: "array",
        error: "wrong_type",
        found: o.links,
      });
    } else {
      o.links.forEach((v) => {
        try {
          const { link, label } = v;
          if (isURL(link)) {
            errors.push({
              name: "links.link",
              expected: "string[type=URL]",
              error: "illformated",
              found: `${link}`,
            });
          }
          if (typeof label !== "string") {
            errors.push({
              name: "links.label",
              expected: "string",
              error: "illformated",
              found: `${label}`,
            });
          }
        } catch (err) {
          errors.push({
            name: "links",
            expected: "object { link, label }",
            error: "illformated",
            found: `${v}`,
          });
        }
      });
    }
  }
  return {
    errors,
    warnings,
  };
};

/** namespace validator helper function */
const namespace = (o) => {
  const warnings = [];
  if (!o["namespace"]) {
    warnings.push({
      name: "namespace",
      expected: "string",
      error: "missing",
      found: "undefined",
    });
  }
  return {
    errors: [],
    warnings,
  };
};

/** Description validator helper function */
const description = (o) => {
  const warnings = [];
  const errors = [];
  if (!o["description"]) {
    warnings.push({
      name: "description",
      expected: "string[type=Markdown]",
      warning: "missing",
      found: "undefined",
    });
  } else {
    if (typeof o.description !== "string") {
      errors.push({
        name: "description",
        expected: "string[type=Markdown]",
        error: "wrong_type",
        found: `${typeof o.description}`,
      });
    }
  }
  return {
    errors: [],
    warnings,
  };
};

/** Metadata validator parser */
const metadata = (request, response, next) => {
  const o = request.body;
  const e = [];
  const w = [];
  [colors(o), description(o), links(o), namespace(o), title(o)].forEach(
    ({ errors, warnings }) => {
      e.concat(errors);
      w.concat(warnings);
    }
  );
  if (w.length > 0) {
    logger.info("Metadata validator finished with warnings", {
      warnings: w.length,
    });
    w.forEach(({ name, expected, found, warning }) => {
      logger.pretty.warn("Metadata warning:", {
        key: name,
        expected: expected,
        found: found,
        type: warning,
      });
    });
  }
  if (e.length === 0) {
    next();
  } else {
    logger.error("Metadata validator finished with errors", {
      errors: e.length,
    });
    e.forEach(({ name, expected, found, error }) => {
      logger.pretty.error("Metadata error:", {
        key: name,
        expected: expected,
        found: found,
        type: error,
      });
    });
    response.status(400).send("Bad Request");
  }
};

module.exports = {
  metadata,
};
