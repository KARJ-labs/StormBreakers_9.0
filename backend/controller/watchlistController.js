const watchlistService = require("../services/watchlistService");

const addToWatchlist = async (req, res) => {
  try {
    const userId = req.id;

    const { symbol, companyName } = req.body;

    const result = await watchlistService.addToWatchlist({
      userId,
      symbol,
      companyName,
    });

    if (result.error) {
      return res.status(result.statusCode || 400).json({
        success: false,
        error: result.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Stock added to watchlist successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("Add watchlist controller error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to add stock to watchlist.",
    });
  }
};

const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.id;

    const data = await watchlistService.getUserWatchlist(userId);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get watchlist controller error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch watchlist.",
    });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.id;

    const { symbol } = req.params;

    const result = await watchlistService.removeFromWatchlist({
      userId,
      symbol,
    });

    if (result.error) {
      return res.status(result.statusCode || 400).json({
        success: false,
        error: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Stock removed from watchlist successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("Remove watchlist controller error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to remove stock from watchlist.",
    });
  }
};

const checkWatchlist = async (req, res) => {
  try {
    const userId = req.id;

    const { symbol } = req.params;

    const data = await watchlistService.isInWatchlist({
      userId,
      symbol,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Check watchlist controller error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to check watchlist.",
    });
  }
};

module.exports = {
  addToWatchlist,
  getUserWatchlist,
  removeFromWatchlist,
  checkWatchlist,
};
