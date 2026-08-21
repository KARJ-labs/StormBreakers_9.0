const marketApi = require("../config/marketApi");

const { calculateRiskScore } = require("./riskService");

const getCompanyDetails = async (symbol) => {
  try {
    if (!symbol || typeof symbol !== "string") {
      throw new Error("Company symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const [quoteResponse, profileResponse] = await Promise.all([
      marketApi.get("/quote", {
        params: {
          symbol: normalizedSymbol,
        },
      }),

      marketApi.get("/stock/profile2", {
        params: {
          symbol: normalizedSymbol,
        },
      }),
    ]);

    const quote = quoteResponse.data;
    const profile = profileResponse.data;

    if (!quote || typeof quote.c !== "number") {
      throw new Error(`No market data found for ${normalizedSymbol}`);
    }

    return {
      symbol: normalizedSymbol,

      company: {
        name: profile?.name || normalizedSymbol,
        ticker: profile?.ticker || normalizedSymbol,
        exchange: profile?.exchange || null,
        industry: profile?.finnhubIndustry || null,
        country: profile?.country || null,
        currency: profile?.currency || null,
        website: profile?.weburl || null,
        logo: profile?.logo || null,
      },

      market: {
        currentPrice: quote.c,
        change: quote.d,
        changePercent: quote.dp,
        high: quote.h,
        low: quote.l,
        open: quote.o,
        previousClose: quote.pc,
        timestamp: quote.t,
      },

      updatedAt: new Date().toISOString(),
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

    const response = await marketApi.get("/stock/metric", {
      params: {
        symbol: normalizedSymbol,
        metric: "all",
      },
    });

    const data = response.data;

    if (!data) {
      throw new Error(`Metrics unavailable for ${normalizedSymbol}`);
    }

    const metric = data.metric || {};

    return {
      symbol: normalizedSymbol,

      metrics: {
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
      },

      updatedAt: new Date().toISOString(),
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

    const response = await marketApi.get("/stock/candle", {
      params: {
        symbol: normalizedSymbol,
        resolution,
        from,
        to,
      },
    });

    const data = response.data;

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
