const validateCreateAlert = (req) => {
  const { symbol, condition, targetPrice } = req.body;

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

  if (!condition) {
    return {
      valid: false,
      statusCode: 400,
      message: "Alert condition is required.",
    };
  }

  if (typeof condition !== "string") {
    return {
      valid: false,
      statusCode: 400,
      message: "Alert condition must be a string.",
    };
  }

  const normalizedCondition = condition.trim().toUpperCase();

  if (!["ABOVE", "BELOW"].includes(normalizedCondition)) {
    return {
      valid: false,
      statusCode: 400,
      message: "Alert condition must be ABOVE or BELOW.",
    };
  }

  if (targetPrice === undefined) {
    return {
      valid: false,
      statusCode: 400,
      message: "Target price is required.",
    };
  }

  if (
    typeof targetPrice !== "number" ||
    !Number.isFinite(targetPrice) ||
    targetPrice <= 0
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: "Target price must be a number greater than zero.",
    };
  }

  return true;
};

module.exports = {
  validateCreateAlert,
};
