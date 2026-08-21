const validateCompanySymbol = (req) => {
  const { symbol } = req.params;

  if (!symbol) {
    return {
      valid: false,
      statusCode: 400,
      message: "Company symbol is required.",
    };
  }

  if (typeof symbol !== "string" || symbol.trim().length === 0) {
    return {
      valid: false,
      statusCode: 400,
      message: "Company symbol must be a valid string.",
    };
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  if (!/^[A-Z0-9.-]{1,20}$/.test(normalizedSymbol)) {
    return {
      valid: false,
      statusCode: 400,
      message: "Invalid company symbol.",
    };
  }

  return true;
};

module.exports = {
  validateCompanySymbol,
};
