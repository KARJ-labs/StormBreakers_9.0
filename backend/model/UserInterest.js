const mongoose = require("mongoose");

const userInterestSchema = new mongoose.Schema(
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

    destinationPlatform: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserInterest = mongoose.model(
  "UserInterest",
  userInterestSchema
);

module.exports = UserInterest;