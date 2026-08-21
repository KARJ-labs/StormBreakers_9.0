const express = require("express");

const validateRequest = require("../middlewares/validateRequest");

const { validateCompanySymbol } = require("../validators/companyValidator");

const {
  getCompanyDetails,
  getCompanyMetrics,
  getCompanyHistory,
  getCompanyRisk,
} = require("../controller/companyController");

const router = express.Router();

router.get(
  "/:symbol",
  validateRequest(validateCompanySymbol),
  getCompanyDetails,
);

router.get(
  "/:symbol/metrics",
  validateRequest(validateCompanySymbol),
  getCompanyMetrics,
);

router.get(
  "/:symbol/history",
  validateRequest(validateCompanySymbol),
  getCompanyHistory,
);

router.get(
  "/:symbol/risk",
  validateRequest(validateCompanySymbol),
  getCompanyRisk,
);

module.exports = router;
