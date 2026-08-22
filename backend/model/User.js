const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phonenumber: {
      type: String,
      required: function () {
        return this.auth_provider === "LOCAL";
      },
      unique: true,
      sparse: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.auth_provider === "LOCAL";
      },
    },

    google_id: {
      type: String,
      unique: true,
      sparse: true,
    },

    auth_provider: {
      type: String,
      enum: ["LOCAL", "GOOGLE"],
      default: "LOCAL",
      required: true,
    },

    profile_picture: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;