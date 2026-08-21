const validateAddPortfolio = (req) => {
  const { symbol, companyName, quantity, averageBuyPrice } = req.body;

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

  if (quantity === undefined) {
    return {
      valid: false,
      statusCode: 400,
      message: "Quantity is required.",
    };
  }

  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: "Quantity must be a number greater than zero.",
    };
  }

  if (averageBuyPrice === undefined) {
    return {
      valid: false,
      statusCode: 400,
      message: "Average buy price is required.",
    };
  }

  if (
    typeof averageBuyPrice !== "number" ||
    !Number.isFinite(averageBuyPrice) ||
    averageBuyPrice < 0
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: "Average buy price must be a valid number.",
    };
  }

  return true;
};

const validateUpdatePortfolio = (req) => {
  const { quantity, averageBuyPrice, companyName } = req.body;

  if (
    quantity === undefined &&
    averageBuyPrice === undefined &&
    companyName === undefined
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: "At least one field is required for update.",
    };
  }

  if (
    quantity !== undefined &&
    (typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0)
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: "Quantity must be a number greater than zero.",
    };
  }

  if (
    averageBuyPrice !== undefined &&
    (typeof averageBuyPrice !== "number" ||
      !Number.isFinite(averageBuyPrice) ||
      averageBuyPrice < 0)
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: "Average buy price must be a valid number.",
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
  validateAddPortfolio,
  validateUpdatePortfolio,
};
