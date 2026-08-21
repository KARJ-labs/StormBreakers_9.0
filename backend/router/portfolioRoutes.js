const express = require("express");

const authMiddleware = require("../middlewares/authorization");
const validateRequest = require("../middlewares/validateRequest");

const {
  validateAddPortfolio,
  validateUpdatePortfolio,
} = require("../validators/portfolioValidator");

const {
  addHolding,
  getPortfolio,
  getPortfolioSummary,
  updateHolding,
  removeHolding,
} = require("../controller/portfolioController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest(validateAddPortfolio),
  addHolding,
);

router.get("/", authMiddleware, getPortfolio);

router.get("/summary", authMiddleware, getPortfolioSummary);

router.put(
  "/:symbol",
  authMiddleware,
  validateRequest(validateUpdatePortfolio),
  updateHolding,
);

router.delete("/:symbol", authMiddleware, removeHolding);

module.exports = router;
