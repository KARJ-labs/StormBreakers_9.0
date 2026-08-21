const express = require("express");

const {
  getCompanyDetails,
  getCompanyMetrics,
  getCompanyHistory,
  getCompanyRisk,
} = require("../controller/companyController");

const router = express.Router();

router.get("/:symbol", getCompanyDetails);

router.get("/:symbol/metrics", getCompanyMetrics);

router.get("/:symbol/history", getCompanyHistory);

router.get("/:symbol/risk", getCompanyRisk);

module.exports = router;
