const marketApi = require("../config/marketApi");

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "NVDA", "AMZN", "GOOGL"];

const getQuote = async (symbol) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Stock symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const response = await marketApi.get("/quote", {
      params: {
        symbol: normalizedSymbol,
      },
    });

    const data = response.data;

    if (!data || typeof data.c !== "number") {
      throw new Error(`No valid market data found for ${normalizedSymbol}`);
    }

    return {
      symbol: normalizedSymbol,
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

    throw error;
  }
};

const getMarketOverview = async () => {
  try {
    const results = await Promise.all(
      DEFAULT_SYMBOLS.map((symbol) => getQuote(symbol)),
    );

    const validResults = results.filter(
      (stock) => typeof stock.currentPrice === "number",
    );

    if (validResults.length === 0) {
      throw new Error("No market data available");
    }

    const totalChange = validResults.reduce(
      (sum, stock) => sum + (stock.changePercent || 0),
      0,
    );

    const averageChangePercent = totalChange / validResults.length;

    return {
      marketStatus: "available",
      averageChangePercent: Number(averageChangePercent.toFixed(2)),
      totalCompanies: validResults.length,
      companies: validResults,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(
      "Market overview error:",
      error.response?.data || error.message,
    );

    throw new Error("Failed to fetch market overview");
  }
};

const getCompanies = async () => {
  try {
    const results = await Promise.all(
      DEFAULT_SYMBOLS.map((symbol) => getQuote(symbol)),
    );

    return results.filter(
      (company) => typeof company.currentPrice === "number",
    );
  } catch (error) {
    console.error(
      "Get companies error:",
      error.response?.data || error.message,
    );

    throw new Error("Failed to fetch companies");
  }
};

const getTrendingCompanies = async () => {
  try {
    const companies = await getCompanies();

    return companies
      .filter((company) => typeof company.changePercent === "number")
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  } catch (error) {
    console.error("Get trending companies error:", error.message);

    throw new Error("Failed to fetch trending companies");
  }
};

const searchCompanies = async (query) => {
  try {
    if (!query || typeof query !== "string") {
      throw new Error("Search query is required");
    }

    const normalizedQuery = query.trim().toUpperCase();

    if (!normalizedQuery) {
      throw new Error("Search query is required");
    }

    const companies = await getCompanies();

    return companies.filter((company) =>
      company.symbol.includes(normalizedQuery),
    );
  } catch (error) {
    console.error("Search companies error:", error.message);

    throw new Error("Failed to search companies");
  }
};

const getHistoricalData = async (symbol, resolution = "D", from, to) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Stock symbol is required");
    }

    if (!from || !to) {
      throw new Error("From and to timestamps are required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const response = await marketApi.get("/stock/candle", {
      params: {
        symbol: normalizedSymbol,
        resolution,
        from,
        to,
      },
    });

    const data = response.data;

    console.log("Finnhub historical response:", JSON.stringify(data, null, 2));

    if (!data || data.s !== "ok") {
      throw new Error(`Historical data unavailable for ${normalizedSymbol}`);
    }

    if (
      !Array.isArray(data.t) ||
      !Array.isArray(data.o) ||
      !Array.isArray(data.h) ||
      !Array.isArray(data.l) ||
      !Array.isArray(data.c) ||
      !Array.isArray(data.v)
    ) {
      throw new Error(
        `Invalid historical data received for ${normalizedSymbol}`,
      );
    }

    const candles = data.t.map((timestamp, index) => ({
      timestamp,
      open: data.o[index],
      high: data.h[index],
      low: data.l[index],
      close: data.c[index],
      volume: data.v[index],
    }));

    return {
      symbol: normalizedSymbol,
      resolution,
      data: candles,
    };
  } catch (error) {
    console.error(
      `Historical market API error for ${symbol}:`,
      error.response?.data || error.message,
    );

    throw error;
  }
};

module.exports = {
  getQuote,
  getMarketOverview,
  getCompanies,
  getTrendingCompanies,
  searchCompanies,
  getHistoricalData,
};
