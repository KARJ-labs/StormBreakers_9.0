const Portfolio = require("../model/Portfolio");
const marketService = require("./marketService");

const addHolding = async ({
  userId,
  symbol,
  companyName = null,
  quantity,
  averageBuyPrice,
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!symbol || typeof symbol !== "string") {
    throw new Error("Stock symbol is required");
  }

  if (
    typeof quantity !== "number" ||
    !Number.isFinite(quantity) ||
    quantity <= 0
  ) {
    throw new Error("Quantity must be greater than zero");
  }

  if (
    typeof averageBuyPrice !== "number" ||
    !Number.isFinite(averageBuyPrice) ||
    averageBuyPrice < 0
  ) {
    throw new Error("Average buy price must be a valid number");
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  const existingHolding = await Portfolio.findOne({
    userId,
    symbol: normalizedSymbol,
  });

  if (existingHolding) {
    const oldQuantity = existingHolding.quantity;

    const oldAveragePrice = existingHolding.averageBuyPrice;

    const totalQuantity = oldQuantity + quantity;

    const totalInvestment =
      oldQuantity * oldAveragePrice + quantity * averageBuyPrice;

    existingHolding.quantity = totalQuantity;

    existingHolding.averageBuyPrice = totalInvestment / totalQuantity;

    if (companyName) {
      existingHolding.companyName = companyName.trim();
    }

    await existingHolding.save();

    return {
      action: "updated",
      holding: existingHolding,
    };
  }

  const holding = await Portfolio.create({
    userId,
    symbol: normalizedSymbol,
    companyName: companyName?.trim() || null,
    quantity,
    averageBuyPrice,
  });

  return {
    action: "created",
    holding,
  };
};

const getPortfolio = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const holdings = await Portfolio.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  const portfolio = await Promise.all(
    holdings.map(async (holding) => {
      let currentPrice = null;

      try {
        const quote = await marketService.getQuote(holding.symbol);

        currentPrice = quote.currentPrice;
      } catch (error) {
        console.error(
          `Unable to fetch price for ${holding.symbol}:`,
          error.message,
        );
      }

      const investedAmount = holding.quantity * holding.averageBuyPrice;

      const currentValue =
        typeof currentPrice === "number"
          ? holding.quantity * currentPrice
          : null;

      const profitLoss =
        currentValue !== null ? currentValue - investedAmount : null;

      const profitLossPercent =
        profitLoss !== null && investedAmount > 0
          ? (profitLoss / investedAmount) * 100
          : null;

      return {
        id: holding._id,
        symbol: holding.symbol,
        companyName: holding.companyName,
        quantity: holding.quantity,
        averageBuyPrice: holding.averageBuyPrice,
        currentPrice,
        investedAmount,
        currentValue,
        profitLoss,
        profitLossPercent,
        addedAt: holding.addedAt,
      };
    }),
  );

  return portfolio;
};

const getPortfolioSummary = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const portfolio = await getPortfolio(userId);

  const totalInvested = portfolio.reduce(
    (total, holding) => total + holding.investedAmount,
    0,
  );

  const totalCurrentValue = portfolio.reduce(
    (total, holding) => total + (holding.currentValue || 0),
    0,
  );

  const totalProfitLoss = totalCurrentValue - totalInvested;

  const totalProfitLossPercent =
    totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return {
    totalHoldings: portfolio.length,
    totalInvested,
    totalCurrentValue,
    totalProfitLoss,
    totalProfitLossPercent,
  };
};

const updateHolding = async ({
  userId,
  symbol,
  quantity,
  averageBuyPrice,
  companyName,
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!symbol || typeof symbol !== "string") {
    throw new Error("Stock symbol is required");
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  const holding = await Portfolio.findOne({
    userId,
    symbol: normalizedSymbol,
  });

  if (!holding) {
    return {
      error: true,
      statusCode: 404,
      message: "Holding not found in portfolio.",
    };
  }

  if (
    quantity !== undefined &&
    (typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0)
  ) {
    return {
      error: true,
      statusCode: 400,
      message: "Quantity must be greater than zero.",
    };
  }

  if (
    averageBuyPrice !== undefined &&
    (typeof averageBuyPrice !== "number" ||
      !Number.isFinite(averageBuyPrice) ||
      averageBuyPrice < 0)
  ) {
    return {
      error: true,
      statusCode: 400,
      message: "Average buy price must be a valid number.",
    };
  }

  if (quantity !== undefined) {
    holding.quantity = quantity;
  }

  if (averageBuyPrice !== undefined) {
    holding.averageBuyPrice = averageBuyPrice;
  }

  if (companyName !== undefined) {
    holding.companyName = companyName?.trim() || null;
  }

  await holding.save();

  return {
    error: false,
    holding,
  };
};

const removeHolding = async ({ userId, symbol }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!symbol || typeof symbol !== "string") {
    throw new Error("Stock symbol is required");
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  const holding = await Portfolio.findOneAndDelete({
    userId,
    symbol: normalizedSymbol,
  });

  if (!holding) {
    return {
      error: true,
      statusCode: 404,
      message: "Holding not found in portfolio.",
    };
  }

  return {
    error: false,
    holding,
  };
};

module.exports = {
  addHolding,
  getPortfolio,
  getPortfolioSummary,
  updateHolding,
  removeHolding,
};
