const express = require("express");

const authMiddleware = require("../middlewares/authorization");

const {
  analyzeCompany,
} = require("../controller/companyAnalyzerController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  analyzeCompany,
);

module.exports = router;