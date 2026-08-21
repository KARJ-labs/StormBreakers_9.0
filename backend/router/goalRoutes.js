const express = require("express");

const authMiddleware = require("../middlewares/authorization");

const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalProgress
} = require("../controller/goalController");

const router = express.Router();

router.post("/", authMiddleware, createGoal);
router.get("/", authMiddleware, getGoals);
router.get("/:id/progress",authMiddleware,getGoalProgress);
router.get("/:id", authMiddleware, getGoalById);
router.put("/:id", authMiddleware, updateGoal);
router.delete("/:id", authMiddleware, deleteGoal);
module.exports = router;