const watchlistService = require("./watchlistService");
const portfolioService = require("./portfolioService");
const alertService = require("./alertService");
const marketService = require("./marketService");

const getDashboard = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const [portfolio, portfolioSummary, watchlist, activeAlerts, marketOverview] =
    await Promise.all([
      portfolioService.getPortfolio(userId),
      portfolioService.getPortfolioSummary(userId),
      watchlistService.getUserWatchlist(userId),
      alertService.getActiveAlerts(userId),
      marketService.getMarketOverview(),
    ]);

  return {
    portfolio: {
      summary: portfolioSummary,
      holdings: portfolio,
    },

    watchlist: {
      count: watchlist.length,
      items: watchlist,
    },

    alerts: {
      count: activeAlerts.length,
      active: activeAlerts,
    },

    market: {
      overview: marketOverview,
    },

    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  getDashboard,
};
