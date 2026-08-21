const express = require("express");

const validateRequest = require("../middlewares/validateRequest");

const {
  validateSymbol,
  validateOverview,
} = require("../validators/marketValidator");

const {
  getQuote,
  getMarketOverview,
  getCompanies,
  getTrending,
  searchCompanies,
  getHistoricalData,
} = require("../controller/marketController");

const router = express.Router();

router.get("/quote/:symbol", validateRequest(validateSymbol), getQuote);

router.get("/overview", validateRequest(validateOverview), getMarketOverview);

router.get("/companies", getCompanies);

router.get("/trending", getTrending);

router.get("/search", searchCompanies);

router.get("/historical/:symbol", getHistoricalData);



module.exports = router;
