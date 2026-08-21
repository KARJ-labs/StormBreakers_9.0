const express = require("express");

const {
  getQuote,
  getMarketOverview,
  getCompanies,
  getTrendingCompanies,
  searchCompanies,
  getHistoricalData,
} = require("../controller/marketController");

const router = express.Router();

// Market quote
router.get("/quote/:symbol", getQuote);

// Market overview
router.get("/overview", getMarketOverview);

// Companies
router.get("/companies", getCompanies);

// Trending companies
router.get("/trending", getTrendingCompanies);

// Search companies
router.get("/search", searchCompanies);

// Historical market data
router.get("/history/:symbol", getHistoricalData);

module.exports = router;
