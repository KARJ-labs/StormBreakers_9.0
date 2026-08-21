const marketApi = require("../config/marketApi");

const getQuote = async (symbol) => {
  try {
    if (!symbol) {
      throw new Error("Stock symbol is required");
    }

    const response = await marketApi.get("/quote", {
      params: {
        symbol: symbol.toUpperCase(),
      },
    });

    const data = response.data;

    if (!data || typeof data.c !== "number" || typeof data.pc !== "number") {
      throw new Error(`No valid market data found for ${symbol}`);
    }

    return {
      symbol: symbol.toUpperCase(),
      currentPrice: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t,
    };
  } catch (error) {
    console.error(
      `Market API error for ${symbol}:`,
      error.response?.data || error.message,
    );

    throw new Error("Failed to fetch market data");
  }
};

module.exports = {
  getQuote,
};
