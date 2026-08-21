const express = require("express");

const authMiddleware = require("../middlewares/authorization");

const {
  addHolding,
  getPortfolio,
  getPortfolioSummary,
  updateHolding,
  removeHolding,
} = require("../controller/portfolioController");

const router = express.Router();

router.post("/", authMiddleware, addHolding);

router.get("/", authMiddleware, getPortfolio);

router.get("/summary", authMiddleware, getPortfolioSummary);

router.put("/:symbol", authMiddleware, updateHolding);

router.delete("/:symbol", authMiddleware, removeHolding);

module.exports = router;
