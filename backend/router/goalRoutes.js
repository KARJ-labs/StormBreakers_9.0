const express = require("express");

const authMiddleware = require("../middlewares/authorization");

const {
  createGoal,
} = require("../controller/goalController");

const router = express.Router();

router.post("/", authMiddleware, createGoal);

module.exports = router;