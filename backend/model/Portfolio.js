const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
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
      uppercase: true,
      trim: true,
    },

    companyName: {
      type: String,
      default: null,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.000001,
    },

    averageBuyPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

portfolioSchema.index(
  {
    userId: 1,
    symbol: 1,
  },
  {
    unique: true,
  },
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;
