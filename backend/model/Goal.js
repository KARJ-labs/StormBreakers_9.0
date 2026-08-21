const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    targetDate: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "emergency_fund",
        "education",
        "travel",
        "vehicle",
        "home",
        "investment",
        "other",
      ],
      default: "other",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Goal", goalSchema);