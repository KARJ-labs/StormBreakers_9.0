const express = require("express");

const {
  getQuote,
  getMarketOverview,
  getCompanies,
  getTrending,
  searchCompanies,
  getHistoricalData,
} = require("../controller/marketController");

const router = express.Router();

router.get("/quote/:symbol", getQuote);

router.get("/overview", getMarketOverview);

router.get("/companies", getCompanies);

router.get("/trending", getTrending);

router.get("/search", searchCompanies);

router.get("/history/:symbol", getHistoricalData);

module.exports = router;
