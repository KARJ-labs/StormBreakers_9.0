const express = require("express");

const validateRequest = require("../middlewares/validateRequest");

const {
  validateSymbol,
  validateOverview,
} = require("../validators/marketValidator");

const {
  getQuote,
  getMarketOverview,
} = require("../controller/marketController");

const router = express.Router();

router.get("/quote/:symbol", validateRequest(validateSymbol), getQuote);

router.get("/overview", validateRequest(validateOverview), getMarketOverview);

module.exports = router;
