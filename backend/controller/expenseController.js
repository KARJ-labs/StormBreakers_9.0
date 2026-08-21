const Expense = require("../model/Expense");
const FinancialProfile = require("../model/FinancialProfile");


const getIndiaDateParts = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);

  const result = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      result[part.type] = part.value;
    }
  }

  return {
    year: Number(result.year),
    month: Number(result.month),
    day: Number(result.day),
  };
};

const createExpense = async (req, res) => {
  try {
    const {
      amount,
      category,
      description,
      date,
      paymentMethod,
    } = req.body;

    if (amount === undefined || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Amount, category and date are required",
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a number greater than 0",
      });
    }

    const expenseDate = new Date(date);

    if (Number.isNaN(expenseDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense date",
      });
    }

    const expense = await Expense.create({
      user: req.id,
      amount,
      category,
      description,
      date: expenseDate,
      paymentMethod,
    });

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Create Expense Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid expense data",
        errors: Object.values(error.errors).map(
          (err) => err.message,
        ),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create expense",
    });
  }
};


const getExpenses = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 20,
      category,
      startDate,
      endDate,
    } = req.query;

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

    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        const start = new Date(startDate);

        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid startDate",
          });
        }

        start.setHours(0, 0, 0, 0);
        filter.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);

        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid endDate",
          });
        }

        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),

      Expense.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Expenses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOne({
      _id: id,
      user: req.id,
    }).select("-__v");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error("Get Expense By ID Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch expense",
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "amount",
      "category",
      "description",
      "date",
      "paymentMethod",
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

    if (updates.amount !== undefined) {
      if (
        typeof updates.amount !== "number" ||
        updates.amount <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a number greater than 0",
        });
      }
    }

    if (updates.date !== undefined) {
      const expenseDate = new Date(updates.date);

      if (Number.isNaN(expenseDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expense date",
        });
      }

      updates.date = expenseDate;
    }

    const expense = await Expense.findOneAndUpdate(
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

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Update Expense Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid expense data",
        errors: Object.values(error.errors).map(
          (err) => err.message,
        ),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      user: req.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: {
        id: expense._id,
      },
    });
  } catch (error) {
    console.error("Delete Expense Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
};

const getExpenseSummary = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;

    const allowedPeriods = ["daily", "weekly", "monthly"];

    if (!allowedPeriods.includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Period must be daily, weekly or monthly",
      });
    }

   const now = new Date();

const { year, month, day } = getIndiaDateParts(now);

const endDate = new Date(
  Date.UTC(year, month - 1, day + 1) -
    5.5 * 60 * 60 * 1000,
);

let startDate;

if (period === "daily") {
  startDate = new Date(
    Date.UTC(year, month - 1, day) -
      5.5 * 60 * 60 * 1000,
  );
}

if (period === "weekly") {
  const indiaDate = new Date(year, month - 1, day);

  const dayOfWeek = indiaDate.getDay();
  const difference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  indiaDate.setDate(indiaDate.getDate() - difference);

  startDate = new Date(
    Date.UTC(
      indiaDate.getFullYear(),
      indiaDate.getMonth(),
      indiaDate.getDate(),
    ) -
      5.5 * 60 * 60 * 1000,
  );
}

if (period === "monthly") {
  startDate = new Date(
    Date.UTC(year, month - 1, 1) -
      5.5 * 60 * 60 * 1000,
  );
}

const expenses = await Expense.find({
  user: req.id,
  date: {
    $gte: startDate,
    $lt: endDate,
  },
}).select("amount category");
    

    let totalSpending = 0;

    const categoryBreakdown = {};

    for (const expense of expenses) {
      totalSpending += expense.amount;

      if (!categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] = 0;
      }

      categoryBreakdown[expense.category] += expense.amount;
    }

    const financialProfile = await FinancialProfile.findOne({
      user: req.id,
    }).select("monthlyIncome");

    let expenseRatio = null;
    let savingsRate = null;

    if (
      period === "monthly" &&
      financialProfile &&
      financialProfile.monthlyIncome > 0
    ) {
      expenseRatio =
        (totalSpending / financialProfile.monthlyIncome) * 100;

      savingsRate =
        ((financialProfile.monthlyIncome - totalSpending) /
          financialProfile.monthlyIncome) *
        100;
    }

    return res.status(200).json({
      success: true,
      data: {
        period,
        startDate,
        endDate: now,
        totalSpending,
        transactionCount: expenses.length,
        categoryBreakdown,
        expenseRatio:
          expenseRatio !== null
            ? Number(expenseRatio.toFixed(2))
            : null,
        savingsRate:
          savingsRate !== null
            ? Number(savingsRate.toFixed(2))
            : null,
      },
    });
  } catch (error) {
    console.error("Expense Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate expense summary",
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
};