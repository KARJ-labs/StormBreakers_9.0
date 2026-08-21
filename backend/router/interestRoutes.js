const express = require("express");

const authorization = require("../middlewares/authorization");

const {
  getInterests,
  createInterest,
  deleteInterest,
} = require("../controller/interestController");

const router = express.Router();

// GET /api/v1/interests
router.get(
  "/",
  authorization,
  getInterests
);

// POST /api/v1/interests
router.post(
  "/",
  authorization,
  createInterest
);

// DELETE /api/v1/interests/:symbol
router.delete(
  "/:symbol",
  authorization,
  deleteInterest
);

module.exports = router;