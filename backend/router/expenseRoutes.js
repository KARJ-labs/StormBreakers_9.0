const express = require("express");

const authMiddleware = require("../middlewares/authorization");
const {
  createExpense,
} = require("../controller/expenseController");

const router = express.Router();

router.post("/", authMiddleware, createExpense);

module.exports = router;