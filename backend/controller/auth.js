const jwt = require("jsonwebtoken");
const User = require("../model/authmodel");
const bcrypt = require("bcrypt");

exports.register = async (req, res, next) => {
  try {
    const { name, email, phonenumber, password } = req.body;

    if (!name || !email || !phonenumber || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, phone number and password are required.",
      });
    }

    const existingUser = await User.checkUserByEmail(email);

    if (existingUser && existingUser.error) {
      return res.status(409).json({
        success: false,
        error: existingUser.error,
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const result = await User.createUser({
      name,
      email,
      phonenumber,
      password: hashpassword,
    });

    if (result.error) {
      if (result.message && result.message.includes("users_phonenumber_key")) {
        return res.status(409).json({
          success: false,
          error: "Phone number is already registered.",
        });
      }

      if (result.message && result.message.includes("users_email_key")) {
        return res.status(409).json({
          success: false,
          error: "Email is already registered.",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Failed to register user. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: String(result._id),
        name: result.name,
        email: result.email,
        phonenumber: result.phonenumber,
        auth_provider: result.auth_provider,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const result = await User.login(email, password);

    if (result?.error) {
      return res.status(401).json({
        success: false,
        error: result.error,
      });
    }

    if (!result?.user) {
      return res.status(401).json({
        success: false,
        error: "Invalid login credentials.",
      });
    }

    const userId = String(result.user._id);

    const token = jwt.sign(
      {
        id: userId,
        email: result.user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: userId,
        email: result.user.email,
      },
      process.env.REFRESH_KEY,
      {
        expiresIn: "7d",
      },
    );

    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.cookie("refreshtoken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: userId,
        name: result.user.name,
        email: result.user.email,
        auth_provider: result.user.auth_provider,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.forgetpassword = async (req, res, next) => {
  try {
    const { email, newpassword, confirm } = req.body;

    if (!email || !newpassword || !confirm) {
      return res.status(400).json({
        success: false,
        error: "Email, new password and confirmation are required.",
      });
    }

    if (newpassword !== confirm) {
      return res.status(400).json({
        success: false,
        error: "New password and confirmation do not match.",
      });
    }

    const user = await User.getUserByEmail(email);

    if (!user || user.error) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const hash = await bcrypt.hash(newpassword, 10);

    const updatepass = await User.resetPassword({
      newpassword: hash,
      email,
    });

    if (!updatepass || updatepass.error) {
      return res.status(500).json({
        success: false,
        error: "Failed to reset password. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetpassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;

    const email = req.email;

    if (!oldpassword || !newpassword) {
      return res.status(400).json({
        success: false,
        error: "Old password and new password are required.",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Authenticated email not found.",
      });
    }

    const user = await User.getUserByEmail(email);

    if (!user || user.error) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(oldpassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "The current password you entered is incorrect.",
      });
    }

    const hash = await bcrypt.hash(newpassword, 10);

    const resetpass = await User.resetPassword({
      newpassword: hash,
      email,
    });

    if (!resetpass || resetpass.error) {
      return res.status(500).json({
        success: false,
        error: "Failed to change password. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    };

    res.clearCookie("token", cookieOptions);

    res.clearCookie("refreshtoken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res) => {
  return res.status(200).json({
    success: true,
    email: req.email,
    userId: req.id,
    message: "Token is valid.",
  });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshtoken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "Refresh token is required.",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);

    const newToken = jwt.sign(
      {
        id: decoded.id,
        email: decoded.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      },
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
    });
  } catch (err) {
    console.error("Refresh token error:", err.message);

    return res.status(401).json({
      success: false,
      error: "Invalid or expired refresh token.",
    });
  }
};
