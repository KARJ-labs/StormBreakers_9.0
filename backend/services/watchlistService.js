const Watchlist = require("../model/Watchlist");

const addToWatchlist = async ({ userId, symbol, companyName = null }) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!symbol || typeof symbol !== "string") {
      throw new Error("Stock symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const existingItem = await Watchlist.findOne({
      userId,
      symbol: normalizedSymbol,
    });

    if (existingItem) {
      return {
        error: true,
        statusCode: 409,
        message: "This stock is already in your watchlist.",
      };
    }

    const watchlistItem = await Watchlist.create({
      userId,
      symbol: normalizedSymbol,
      companyName: companyName?.trim() || null,
    });

    return {
      error: false,
      data: watchlistItem,
    };
  } catch (error) {
    console.error("Add watchlist error:", error.message);

    if (error.code === 11000) {
      return {
        error: true,
        statusCode: 409,
        message: "This stock is already in your watchlist.",
      };
    }

    throw error;
  }
};

const getUserWatchlist = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const watchlist = await Watchlist.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return watchlist;
  } catch (error) {
    console.error("Get watchlist error:", error.message);

    throw error;
  }
};

const removeFromWatchlist = async ({ userId, symbol }) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!symbol || typeof symbol !== "string") {
      throw new Error("Stock symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const result = await Watchlist.findOneAndDelete({
      userId,
      symbol: normalizedSymbol,
    });

    if (!result) {
      return {
        error: true,
        statusCode: 404,
        message: "Stock not found in your watchlist.",
      };
    }

    return {
      error: false,
      data: result,
    };
  } catch (error) {
    console.error("Remove watchlist error:", error.message);

    throw error;
  }
};

const isInWatchlist = async ({ userId, symbol }) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!symbol || typeof symbol !== "string") {
      throw new Error("Stock symbol is required");
    }

    const normalizedSymbol = symbol.trim().toUpperCase();

    const item = await Watchlist.findOne({
      userId,
      symbol: normalizedSymbol,
    }).lean();

    return {
      symbol: normalizedSymbol,
      isInWatchlist: Boolean(item),
    };
  } catch (error) {
    console.error("Check watchlist error:", error.message);

    throw error;
  }
};

module.exports = {
  addToWatchlist,
  getUserWatchlist,
  removeFromWatchlist,
  isInWatchlist,
};
