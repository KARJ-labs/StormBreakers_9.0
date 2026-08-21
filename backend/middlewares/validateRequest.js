const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema(req);

      if (result === true) {
        return next();
      }

      if (!result || typeof result !== "object") {
        return res.status(400).json({
          success: false,
          error: "Invalid request.",
        });
      }

      if (result.valid === false) {
        return res.status(result.statusCode || 400).json({
          success: false,
          error: result.message || "Invalid request data.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validateRequest;
