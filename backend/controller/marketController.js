const marketService = require("../services/marketService");

const getQuote = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: "Stock symbol is required.",
      });
    }

    const quote = await marketService.getQuote(symbol);

    return res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error("Get market quote error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch market data.",
    });
  }
};

const getMarketOverview = async (req, res) => {
  try {
    const overview = await marketService.getMarketOverview();

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("Get market overview error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch market overview.",
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await marketService.getCompanies();

    return res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Get companies error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch companies.",
    });
  }
};

const getTrendingCompanies = async (req, res) => {
  try {
    const companies = await marketService.getTrendingCompanies();

    return res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Get trending companies error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch trending companies.",
    });
  }
};

const searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Search query is required.",
      });
    }

    const companies = await marketService.searchCompanies(q);

    return res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error("Search companies error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to search companies.",
    });
  }
};

const getHistoricalData = async (req, res) => {
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

    const historicalData = await marketService.getHistoricalData(
      symbol,
      resolution || "D",
      from,
      to,
    );

    return res.status(200).json({
      success: true,
      data: historicalData,
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
  getTrendingCompanies,
  searchCompanies,
  getHistoricalData,
};
