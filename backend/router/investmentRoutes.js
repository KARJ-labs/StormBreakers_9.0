const express = require("express");

const authorization = require("../middlewares/authorization");

const {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} = require("../controller/investmentController");

const router = express.Router();

// GET /api/v1/investments
router.get(
  "/",
  authorization,
  getInvestments
);

// POST /api/v1/investments
router.post(
  "/",
  authorization,
  createInvestment
);

// PUT /api/v1/investments/:id
router.put(
  "/:id",
  authorization,
  updateInvestment
);

// DELETE /api/v1/investments/:id
router.delete(
  "/:id",
  authorization,
  deleteInvestment
);

module.exports = router;