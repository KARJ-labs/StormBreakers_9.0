const Goal = require("../model/Goal");

const createGoal = async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      targetDate,
      category,
      priority,
      description,
    } = req.body;

    if (!name || targetAmount === undefined || !targetDate) {
      return res.status(400).json({
        success: false,
        message: "Name, targetAmount and targetDate are required",
      });
    }

    if (
      typeof targetAmount !== "number" ||
      targetAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Target amount must be a number greater than 0",
      });
    }

    if (currentAmount !== undefined) {
      if (
        typeof currentAmount !== "number" ||
        currentAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Current amount must be a non-negative number",
        });
      }

      if (currentAmount > targetAmount) {
        return res.status(400).json({
          success: false,
          message: "Current amount cannot exceed target amount",
        });
      }
    }

    const parsedTargetDate = new Date(targetDate);

    if (Number.isNaN(parsedTargetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid target date",
      });
    }

    const goal = await Goal.create({
      user: req.id,
      name,
      targetAmount,
      currentAmount: currentAmount ?? 0,
      targetDate: parsedTargetDate,
      category,
      priority,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: goal,
    });
  } catch (error) {
    console.error("Create Goal Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid goal data",
        errors: Object.values(error.errors).map(
          (err) => err.message,
        ),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create goal",
    });
  }
};

module.exports = {
  createGoal,
};