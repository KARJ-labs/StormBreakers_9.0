const marketProvider = require("./providers/marketProvider");

const { getCachedCompany, setCachedCompany } = require("./cacheService");

const getQuote = async (symbol) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Stock symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const cachedCompany = await getCachedCompany(normalizedSymbol);

    if (
      cachedCompany &&
      cachedCompany.market &&
      typeof cachedCompany.market.currentPrice === "number"
    ) {
      return {
        symbol: normalizedSymbol,
        currentPrice: cachedCompany.market.currentPrice,
        change: cachedCompany.market.change,
        changePercent: cachedCompany.market.changePercent,
        high: cachedCompany.market.high,
        low: cachedCompany.market.low,
        open: cachedCompany.market.open,
        previousClose: cachedCompany.market.previousClose,
        timestamp: cachedCompany.market.timestamp,
        source: "cache",
      };
    }

    const data = await marketProvider.getQuote(normalizedSymbol);

    if (!data || typeof data.c !== "number") {
      throw new Error(`No quote data found for ${normalizedSymbol}`);
    }

    const market = {
      currentPrice: data.c,
      change: data.d ?? null,
      changePercent: data.dp ?? null,
      high: data.h ?? null,
      low: data.l ?? null,
      open: data.o ?? null,
      previousClose: data.pc ?? null,
      timestamp: data.t ?? null,
    };

    await setCachedCompany(normalizedSymbol, {
      market,
    });

    return {
      symbol: normalizedSymbol,
      ...market,
      source: "external-api",
    };
  } catch (error) {
    console.error(
      `Quote API error for ${symbol}:`,
      error.response?.data || error.message,
    );

    throw error;
  }
};

const getMarketOverview = async () => {
  try {
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"];

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const quote = await getQuote(symbol);

          return {
            symbol,
            ...quote,
          };
        } catch (error) {
          return {
            symbol,
            error: "Unable to fetch quote",
          };
        }
      }),
    );

    return results;
  } catch (error) {
    console.error("Market overview error:", error.message);

    throw error;
  }
};

const getCompanies = async () => {
  try {
    const data = await marketProvider.getCompanies();

    if (!Array.isArray(data)) {
      throw new Error("Invalid company data received from market API");
    }

    return data.map((company) => ({
      symbol: company.symbol,
      description: company.description,
      displaySymbol: company.displaySymbol,
      type: company.type,
      currency: company.currency,
      exchange: company.exchange,
    }));
  } catch (error) {
    console.error(
      "Companies API error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

const getTrending = async () => {
  try {
    const symbols = ["AAPL", "NVDA", "TSLA", "AMZN", "MSFT", "META", "GOOGL"];

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const quote = await getQuote(symbol);

          return {
            symbol,
            currentPrice: quote.currentPrice,
            change: quote.change,
            changePercent: quote.changePercent,
          };
        } catch (error) {
          return null;
        }
      }),
    );

    return results
      .filter(Boolean)
      .sort(
        (a, b) =>
          Math.abs(b.changePercent || 0) - Math.abs(a.changePercent || 0),
      );
  } catch (error) {
    console.error("Trending API error:", error.message);

    throw error;
  }
};

const searchCompanies = async (query) => {
  try {
    if (!query || typeof query !== "string") {
      throw new Error("Search query is required");
    }

    const data = await marketProvider.searchCompanies(query.trim());

    if (!data || !Array.isArray(data.result)) {
      return [];
    }

    return data.result.map((company) => ({
      symbol: company.symbol,
      description: company.description,
      displaySymbol: company.displaySymbol,
      type: company.type,
    }));
  } catch (error) {
    console.error(
      "Company search API error:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

const getHistoricalData = async (symbol, resolution = "D", from, to) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Stock symbol is required");
    }

    if (!from || !to) {
      throw new Error("from and to timestamps are required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const data = await marketProvider.getHistoricalData(
      normalizedSymbol,
      resolution,
      from,
      to,
    );

    if (!data || data.s !== "ok") {
      throw new Error(`Historical data unavailable for ${normalizedSymbol}`);
    }

    const history = [];

    for (let i = 0; i < data.t.length; i++) {
      history.push({
        timestamp: data.t[i],
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i],
      });
    }

    return {
      symbol: normalizedSymbol,
      resolution,
      history,
      source: "external-api",
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
  getTrending,
  searchCompanies,
  getHistoricalData,
};
