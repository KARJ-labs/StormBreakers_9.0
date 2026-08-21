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
      index: true,
    },

    phonenumber: {
      type: String,
      required: function () {
        return this.auth_provider === "LOCAL";
      },
      unique: true,
      sparse: true,
      trim: true,
      index: true,
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
      index: true,
    },

    auth_provider: {
      type: String,
      enum: ["LOCAL", "GOOGLE"],
      default: "LOCAL",
    },

    profile_picture: {
      type: String,
      default: null,
    },

    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otp_expire_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
