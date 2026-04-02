const ApiError = require("../utils/ApiError");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const target = source === "query" ? req.query : req.body;

    const { error, value } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((d) => d.message.replace(/['"]/g, ""));
      return next(ApiError.badRequest("Validation failed.", messages));
    }

    // Replace validated + sanitized values back
    if (source === "query") {
      req.query = value;
    } else {
      req.body = value;
    }

    next();
  };
};

module.exports = validate;
