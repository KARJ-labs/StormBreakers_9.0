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

    if (typeof targetAmount !== "number" || targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Target amount must be a number greater than 0",
      });
    }

    if (currentAmount !== undefined) {
      if (typeof currentAmount !== "number" || currentAmount < 0) {
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
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create goal",
    });
  }
};

const getGoals = async (req, res) => {
  try {
    let { page = 1, limit = 20, status, category } = req.query;

    page = Number(page);
    limit = Number(limit);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
    }

    const filter = {
      user: req.id,
    };

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;

    const [goals, total] = await Promise.all([
      Goal.find(filter)
        .sort({ targetDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),

      Goal.countDocuments(filter),
    ]);

    const data = goals.map((goal) => {
      const targetAmount = goal.targetAmount;
      const currentAmount = goal.currentAmount;

      const progressPercentage =
        targetAmount > 0
          ? Math.min((currentAmount / targetAmount) * 100, 100)
          : 0;

      const remainingAmount = Math.max(targetAmount - currentAmount, 0);

      const today = new Date();

      const daysRemaining = Math.max(
        Math.ceil((goal.targetDate - today) / (1000 * 60 * 60 * 24)),
        0,
      );

      return {
        ...goal.toObject(),
        progressPercentage: Number(progressPercentage.toFixed(2)),
        remainingAmount,
        daysRemaining,
      };
    });

    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Goals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
    });
  }
};

const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOne({
      _id: id,
      user: req.id,
    }).select("-__v");

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const targetAmount = goal.targetAmount;
    const currentAmount = goal.currentAmount;

    const progressPercentage =
      targetAmount > 0
        ? Math.min((currentAmount / targetAmount) * 100, 100)
        : 0;

    const remainingAmount = Math.max(targetAmount - currentAmount, 0);

    const today = new Date();

    const daysRemaining = Math.max(
      Math.ceil((goal.targetDate - today) / (1000 * 60 * 60 * 24)),
      0,
    );

    return res.status(200).json({
      success: true,
      data: {
        ...goal.toObject(),
        progressPercentage: Number(progressPercentage.toFixed(2)),
        remainingAmount,
        daysRemaining,
      },
    });
  } catch (error) {
    console.error("Get Goal By ID Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch goal",
    });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "name",
      "targetAmount",
      "currentAmount",
      "targetDate",
      "category",
      "priority",
      "status",
      "description",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (updates.targetAmount !== undefined) {
      if (
        typeof updates.targetAmount !== "number" ||
        updates.targetAmount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Target amount must be a number greater than 0",
        });
      }
    }

    if (updates.currentAmount !== undefined) {
      if (
        typeof updates.currentAmount !== "number" ||
        updates.currentAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Current amount must be a non-negative number",
        });
      }
    }

    // If either amount is being changed, retrieve the existing
    // target/current amounts so we can validate the final values.
    if (
      updates.targetAmount !== undefined ||
      updates.currentAmount !== undefined
    ) {
      const existingGoal = await Goal.findOne({
        _id: id,
        user: req.id,
      }).select("targetAmount currentAmount");

      if (!existingGoal) {
        return res.status(404).json({
          success: false,
          message: "Goal not found",
        });
      }

      const finalTargetAmount =
        updates.targetAmount ?? existingGoal.targetAmount;

      const finalCurrentAmount =
        updates.currentAmount ?? existingGoal.currentAmount;

      if (finalCurrentAmount > finalTargetAmount) {
        return res.status(400).json({
          success: false,
          message: "Current amount cannot exceed target amount",
        });
      }
    }

    if (updates.targetDate !== undefined) {
      const parsedTargetDate = new Date(updates.targetDate);

      if (Number.isNaN(parsedTargetDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid target date",
        });
      }

      updates.targetDate = parsedTargetDate;
    }

    const goal = await Goal.findOneAndUpdate(
      {
        _id: id,
        user: req.id,
      },
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-__v");

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: goal,
    });
  } catch (error) {
    console.error("Update Goal Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid goal data",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update goal",
    });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({
      _id: id,
      user: req.id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
      data: {
        id: goal._id,
      },
    });
  } catch (error) {
    console.error("Delete Goal Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete goal",
    });
  }
};

const getGoalProgress = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findOne({
      _id: id,
      user: req.id,
    }).select("-__v");

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    const targetAmount = goal.targetAmount;
    const currentAmount = goal.currentAmount;

    const remainingAmount = Math.max(targetAmount - currentAmount, 0);

    const progressPercentage =
      targetAmount > 0
        ? Math.min((currentAmount / targetAmount) * 100, 100)
        : 0;

    const now = new Date();

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const daysRemaining = Math.ceil(
      (goal.targetDate - now) / millisecondsPerDay,
    );

    const safeDaysRemaining = Math.max(daysRemaining, 0);

    let requiredMonthlySavings = 0;

    if (remainingAmount > 0 && safeDaysRemaining > 0) {
      requiredMonthlySavings = remainingAmount / (safeDaysRemaining / 30);
    }

    const isCompleted =
      currentAmount >= targetAmount || goal.status === "completed";

    const isOverdue = !isCompleted && goal.targetDate < now;

    let paceStatus = "on_track";

    if (isCompleted) {
      paceStatus = "completed";
    } else if (isOverdue) {
      paceStatus = "overdue";
    }

    return res.status(200).json({
      success: true,
      data: {
        goalId: goal._id,
        name: goal.name,
        targetAmount,
        currentAmount,
        remainingAmount,

        progressPercentage: Number(progressPercentage.toFixed(2)),

        targetDate: goal.targetDate,
        daysRemaining: safeDaysRemaining,

        requiredMonthlySavings: Number(requiredMonthlySavings.toFixed(2)),

        status: goal.status,
        paceStatus,
      },
    });
  } catch (error) {
    console.error("Get Goal Progress Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to calculate goal progress",
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalProgress,
};
