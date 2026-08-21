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

module.exports = {
  getQuote,
};
