const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "food",
        "transport",
        "housing",
        "utilities",
        "healthcare",
        "education",
        "shopping",
        "entertainment",
        "subscriptions",
        "travel",
        "other",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    date: {
      type: Date,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "cash",
        "debit_card",
        "credit_card",
        "upi",
        "bank_transfer",
        "other",
      ],
      default: "other",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Expense", expenseSchema);