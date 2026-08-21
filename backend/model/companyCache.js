const mongoose = require("mongoose");

const companyCacheSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    company: {
      name: {
        type: String,
        default: null,
      },
      ticker: {
        type: String,
        default: null,
      },
      exchange: {
        type: String,
        default: null,
      },
      industry: {
        type: String,
        default: null,
      },
      country: {
        type: String,
        default: null,
      },
      currency: {
        type: String,
        default: null,
      },
      website: {
        type: String,
        default: null,
      },
      logo: {
        type: String,
        default: null,
      },
    },

    market: {
      currentPrice: {
        type: Number,
        default: null,
      },
      change: {
        type: Number,
        default: null,
      },
      changePercent: {
        type: Number,
        default: null,
      },
      high: {
        type: Number,
        default: null,
      },
      low: {
        type: Number,
        default: null,
      },
      open: {
        type: Number,
        default: null,
      },
      previousClose: {
        type: Number,
        default: null,
      },
      timestamp: {
        type: Number,
        default: null,
      },
    },

    metrics: {
      marketCapitalization: {
        type: Number,
        default: null,
      },
      peRatio: {
        type: Number,
        default: null,
      },
      eps: {
        type: Number,
        default: null,
      },
      dividendYield: {
        type: Number,
        default: null,
      },
      beta: {
        type: Number,
        default: null,
      },
      fiftyTwoWeekHigh: {
        type: Number,
        default: null,
      },
      fiftyTwoWeekLow: {
        type: Number,
        default: null,
      },
      fiftyTwoWeekPriceReturn: {
        type: Number,
        default: null,
      },
      tenDayAverageVolume: {
        type: Number,
        default: null,
      },
      threeMonthAverageVolume: {
        type: Number,
        default: null,
      },
    },

    cachedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

companyCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CompanyCache = mongoose.model("CompanyCache", companyCacheSchema);

module.exports = CompanyCache;
