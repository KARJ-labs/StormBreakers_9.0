const express = require("express");

const authMiddleware = require("../middlewares/authorization");
const {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
} = require("../controller/expenseController");

const router = express.Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/summary", authMiddleware, getExpenseSummary);
router.get("/:id", authMiddleware, getExpenseById);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
