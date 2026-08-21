const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    symbol: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    investmentType: {
      type: String,
      enum: ["STOCK", "ETF", "MUTUAL_FUND", "SIP", "OTHER"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    averageBuyPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    investedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    purchaseDate: {
      type: Date,
      required: true,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;