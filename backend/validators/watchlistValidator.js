const validateAddWatchlist = (req) => {
  const { symbol, companyName } = req.body;

  if (!symbol) {
    return {
      valid: false,
      statusCode: 400,
      message: "Stock symbol is required.",
    };
  }

  if (typeof symbol !== "string" || symbol.trim().length === 0) {
    return {
      valid: false,
      statusCode: 400,
      message: "Stock symbol must be a valid string.",
    };
  }

  if (symbol.trim().length > 20) {
    return {
      valid: false,
      statusCode: 400,
      message: "Stock symbol is too long.",
    };
  }

  if (
    companyName !== undefined &&
    companyName !== null &&
    typeof companyName !== "string"
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: "Company name must be a string.",
    };
  }

  return true;
};

module.exports = {
  validateAddWatchlist,
};
