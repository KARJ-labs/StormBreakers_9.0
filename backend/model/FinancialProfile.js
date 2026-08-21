const mongoose = require("mongoose");

const financialProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    monthlyIncome: {
      type: Number,
      min: 0,
      default: 0,
    },

    monthlyEssentialExpenses: {
      type: Number,
      min: 0,
      default: 0,
    },

    monthlyDiscretionaryExpenses: {
      type: Number,
      min: 0,
      default: 0,
    },

    currentSavings: {
      type: Number,
      min: 0,
      default: 0,
    },

    emergencyFund: {
      type: Number,
      min: 0,
      default: 0,
    },

    existingInvestments: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalDebt: {
      type: Number,
      min: 0,
      default: 0,
    },

    investmentAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    investmentHorizon: {
      type: String,
      enum: ["short", "medium", "long"],
      default: "medium",
    },

    riskTolerance: {
      type: String,
      enum: ["low", "moderate", "high"],
      default: "moderate",
    },

    investmentObjective: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "FinancialProfile",
  financialProfileSchema,
);