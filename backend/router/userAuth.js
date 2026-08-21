const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authorization");
const validateRequest = require("../middlewares/validateRequest");

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../validators/authValidator");

const {
  register,
  varifyUser,
  resendOtp,
  login,
  resetpassword,
  forgetpassword,
  logout,
  verify,
  refreshToken,
} = require("../controller/auth");

router.post("/login", validateRequest(validateLogin), login);

router.post("/register", validateRequest(validateRegister), register);

router.post(
  "/forgot-password",
  validateRequest(validateForgotPassword),
  forgetpassword,
);

router.post(
  "/reset-password",
  authMiddleware,
  validateRequest(validateResetPassword),
  resetpassword,
);

router.post("/logout", authMiddleware, logout);

router.get("/verify", authMiddleware, verify);

router.get("/refresh-token", refreshToken);

module.exports = router;
