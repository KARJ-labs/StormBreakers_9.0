const UserModel = require("./User");
const bcrypt = require("bcrypt");

const User = {
  checkUserByEmail: async (email) => {
    try {
      const user = await UserModel.findOne({ email });

      if (user) {
        return {
          error: "User has registered already, please login!",
        };
      }

      return null;
    } catch (err) {
      console.error("checkUserByEmail error:", err);

      return {
        error: "An error occurred on the server while retrieving the data.",
      };
    }
  },

  getUserByEmail: async (email) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return {
          error: true,
        };
      }

      return user;
    } catch (err) {
      console.error("getUserByEmail error:", err);

      return {
        error: true,
      };
    }
  },

  getUserByGoogleId: async (google_id) => {
    try {
      const user = await UserModel.findOne({ google_id });

      if (!user) {
        return null;
      }

      return user;
    } catch (err) {
      console.error("getUserByGoogleId error:", err);

      return {
        error: true,
      };
    }
  },

  createUser: async ({ name, email, phonenumber, password }) => {
    try {
      const user = await UserModel.create({
        name,
        email,
        phonenumber,
        password,
      });

      return user;
    } catch (err) {
      console.error("createUser error:", err);

      if (err.code === 11000) {
        if (err.keyPattern?.email) {
          return {
            error: true,
            message: "users_email_key",
          };
        }

        if (err.keyPattern?.phonenumber) {
          return {
            error: true,
            message: "users_phonenumber_key",
          };
        }
      }

      return {
        error: true,
        message: err.message || "An error occurred while creating the user.",
      };
    }
  },
  createGoogleUser: async ({ name, email, google_id, profile_picture }) => {
    try {
      const user = await UserModel.create({
        name,
        email,
        google_id,
        profile_picture,
        auth_provider: "GOOGLE",
        is_verified: true,
      });

      return user;
    } catch (err) {
      console.error("createGoogleUser error:", err);

      if (err.code === 11000) {
        if (err.keyPattern?.email) {
          return {
            error: true,
            message: "users_email_key",
          };
        }

        if (err.keyPattern?.google_id) {
          return {
            error: true,
            message: "users_google_id_key",
          };
        }

        if (err.keyPattern?.phonenumber) {
          return {
            error: true,
            message: "users_phonenumber_key",
          };
        }
      }

      return {
        error: true,
        message: err.message || "An error occurred while creating Google user.",
      };
    }
  },

  verifyUser: async (email) => {
    try {
      const user = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            is_verified: true,
            otp: null,
            otp_expire_at: null,
          },
        },
        {
          new: true,
        },
      );

      if (!user) {
        return {
          error: true,
        };
      }

      return user;
    } catch (err) {
      console.error("verifyUser error:", err);

      return {
        error: true,
      };
    }
  },

  updateOtp: async ({ email, otp, otp_expire_at }) => {
    try {
      const user = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            otp,
            otp_expire_at,
          },
        },
        {
          new: true,
        },
      );

      if (!user) {
        return {
          error: true,
        };
      }

      return user;
    } catch (err) {
      console.error("updateOtp error:", err);

      return {
        error: true,
      };
    }
  },

  login: async (email, password) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return {
          error: "No account found with this email. Please register first.",
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return {
          error: "Invalid email and password. Please try again.",
        };
      }

      if (user.is_verified === false) {
        return {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            is_verified: false,
          },
          error: "User not verified. Please verify your account.",
        };
      }

      return {
        message: "login successfull",
        user: user,
      };
    } catch (err) {
      console.error("login error:", err);

      return {
        error:
          "An unexpected error occurred while processing login. Please try again later.",
      };
    }
  },

  resetPassword: async ({ newpassword, email }) => {
    try {
      const user = await UserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            password: newpassword,
          },
        },
        {
          new: true,
        },
      );

      if (!user) {
        return {
          error: true,
        };
      }

      return user;
    } catch (err) {
      console.error("resetPassword error:", err);

      return {
        error: true,
      };
    }
  },
};

module.exports = User;
