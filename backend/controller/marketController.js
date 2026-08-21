const marketService = require("../services/marketService");

const getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: "Stock symbol is required.",
      });
    }

    const data = await marketService.getQuote(symbol);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get quote error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch stock quote.",
    });
  }
};

const getMarketOverview = async (req, res, next) => {
  try {
    const data = await marketService.getMarketOverview();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get market overview error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch market overview.",
    });
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const data = await marketService.getCompanies();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get companies error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch company list.",
    });
  }
};

const getTrending = async (req, res, next) => {
  try {
    const data = await marketService.getTrending();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get trending stocks error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch trending stocks.",
    });
  }
};

const searchCompanies = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Search query is required.",
      });
    }

    const data = await marketService.searchCompanies(q);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Search companies error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to search companies.",
    });
  }
};

const getHistoricalData = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { resolution, from, to } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: "Stock symbol is required.",
      });
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: "from and to timestamps are required.",
      });
    }

    const data = await marketService.getHistoricalData(
      symbol,
      resolution || "D",
      from,
      to,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get historical market data error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch historical market data.",
    });
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
