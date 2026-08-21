const errorHandler = (err, req, res, next) => {
  console.error("Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      error: "Validation failed.",
      details: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid request data.",
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "Duplicate data already exists.",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: "Invalid authentication token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Authentication token expired.",
    });
  }

  if (err.response) {
    const statusCode =
      err.response.status >= 400 && err.response.status < 600
        ? err.response.status
        : 502;

    return res.status(statusCode).json({
      success: false,
      error: "External service request failed.",
    });
  }

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode < 600
      ? err.statusCode
      : 500;

  return res.status(statusCode).json({
    success: false,
    error:
      statusCode === 500
        ? "Something went wrong on the server."
        : err.message || "Request failed.",
  });
};

module.exports = errorHandler;
