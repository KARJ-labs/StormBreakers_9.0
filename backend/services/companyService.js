const marketProvider = require("./providers/marketProvider");

const { getCachedCompany, setCachedCompany } = require("./cacheService");

const { calculateRiskScore } = require("./riskService");

const getCompanyDetails = async (symbol) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Company symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const cachedCompany = await getCachedCompany(normalizedSymbol);

    if (cachedCompany && cachedCompany.company && cachedCompany.market) {
      return {
        symbol: normalizedSymbol,
        company: cachedCompany.company,
        market: cachedCompany.market,
        updatedAt: cachedCompany.cachedAt || new Date().toISOString(),
        source: "cache",
      };
    }

    const [quote, profile] = await Promise.all([
      marketProvider.getQuote(normalizedSymbol),
      marketProvider.getCompanyProfile(normalizedSymbol),
    ]);

    if (!quote || typeof quote.c !== "number") {
      throw new Error(`No market data found for ${normalizedSymbol}`);
    }

    const company = {
      name: profile?.name || normalizedSymbol,
      ticker: profile?.ticker || normalizedSymbol,
      exchange: profile?.exchange || null,
      industry: profile?.finnhubIndustry || null,
      country: profile?.country || null,
      currency: profile?.currency || null,
      website: profile?.weburl || null,
      logo: profile?.logo || null,
    };

    const market = {
      currentPrice: quote.c,
      change: quote.d ?? null,
      changePercent: quote.dp ?? null,
      high: quote.h ?? null,
      low: quote.l ?? null,
      open: quote.o ?? null,
      previousClose: quote.pc ?? null,
      timestamp: quote.t ?? null,
    };

    await setCachedCompany(normalizedSymbol, {
      company,
      market,
    });

    return {
      symbol: normalizedSymbol,
      company,
      market,
      updatedAt: new Date().toISOString(),
      source: "external-api",
    };
  } catch (error) {
    console.error(
      `Company details error for ${symbol}:`,
      error.response?.data || error.message,
    );

    throw error;
  }
};

const getCompanyMetrics = async (symbol) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Company symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const cachedCompany = await getCachedCompany(normalizedSymbol);

    if (
      cachedCompany &&
      cachedCompany.metrics &&
      Object.keys(cachedCompany.metrics).length > 0
    ) {
      return {
        symbol: normalizedSymbol,
        metrics: cachedCompany.metrics,
        updatedAt: cachedCompany.cachedAt || new Date().toISOString(),
        source: "cache",
      };
    }

    const data = await marketProvider.getCompanyMetrics(normalizedSymbol);

    if (!data) {
      throw new Error(`Metrics unavailable for ${normalizedSymbol}`);
    }

    const metric = data.metric || {};

    const metrics = {
      marketCapitalization: metric.marketCapitalization ?? null,
      peRatio: metric.peBasicExclExtraTTM ?? null,
      eps: metric.epsBasicExclExtraItemsTTM ?? null,
      dividendYield: metric.dividendYieldIndicatedAnnual ?? null,
      beta: metric.beta ?? null,
      fiftyTwoWeekHigh: metric["52WeekHigh"] ?? null,
      fiftyTwoWeekLow: metric["52WeekLow"] ?? null,
      fiftyTwoWeekPriceReturn: metric["52WeekPriceReturnDaily"] ?? null,
      tenDayAverageVolume: metric.tenDayAverageTradingVolume ?? null,
      threeMonthAverageVolume: metric.threeMonthAverageTradingVolume ?? null,
    };

    await setCachedCompany(normalizedSymbol, {
      metrics,
    });

    return {
      symbol: normalizedSymbol,
      metrics,
      updatedAt: new Date().toISOString(),
      source: "external-api",
    };
  } catch (error) {
    console.error(
      `Company metrics error for ${symbol}:`,
      error.response?.data || error.message,
    );

    throw error;
  }
};

const getCompanyHistory = async (symbol, resolution = "D", from, to) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Company symbol is required");
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
      `Company history error for ${symbol}:`,
      error.response?.data || error.message,
    );

    throw error;
  }
};

const getCompanyRisk = async (symbol) => {
  try {
    const metricsData = await getCompanyMetrics(symbol);

    const metrics = metricsData.metrics;

    const volatility =
      metrics.fiftyTwoWeekPriceReturn !== null
        ? Math.abs(metrics.fiftyTwoWeekPriceReturn)
        : null;

    const beta = metrics.beta;

    let drawdown = null;

    if (
      typeof metrics.fiftyTwoWeekHigh === "number" &&
      typeof metrics.fiftyTwoWeekLow === "number" &&
      metrics.fiftyTwoWeekHigh > 0
    ) {
      drawdown =
        ((metrics.fiftyTwoWeekHigh - metrics.fiftyTwoWeekLow) /
          metrics.fiftyTwoWeekHigh) *
        100;
    }

    const risk = calculateRiskScore({
      volatility,
      beta,
      drawdown,
    });

    return {
      symbol: metricsData.symbol,
      risk: {
        ...risk,
        indicators: {
          volatility,
          beta,
          drawdown,
        },
      },
      generatedAt: new Date().toISOString(),
      source: metricsData.source,
    };
  } catch (error) {
    console.error(`Company risk error for ${symbol}:`, error.message);

    throw error;
  }
};

module.exports = {
  getCompanyDetails,
  getCompanyMetrics,
  getCompanyHistory,
  getCompanyRisk,
};
