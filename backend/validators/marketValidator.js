const validateSymbol = (req) => {
  const { symbol } = req.params;

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

  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!/^[A-Z0-9.-]{1,20}$/.test(normalizedSymbol)) {
    return {
      valid: false,
      statusCode: 400,
      message: "Invalid stock symbol.",
    };
  }

  return true;
};

const validateOverview = (req) => {
  const { symbols } = req.query;

  if (symbols !== undefined && typeof symbols !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Symbols must be provided as a string.",
    };
  }

  if (typeof symbols === "string" && symbols.trim().length > 500) {
    return {
      valid: false,
      statusCode: 400,
      message: "Too many symbols provided.",
    };
  }

  return true;
};

module.exports = {
  validateSymbol,
  validateOverview,
};
