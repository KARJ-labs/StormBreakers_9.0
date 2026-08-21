const Expense = require("../model/Expense");

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

module.exports = {
  createExpense,
};