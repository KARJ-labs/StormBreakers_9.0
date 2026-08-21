const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authorization");

const {
  register,
  login,
  resetpassword,
  forgetpassword,
  logout,
  verify,
  refreshToken,
} = require("../controller/auth");

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgetpassword);

router.post("/reset-password", authMiddleware, resetpassword);

router.post("/logout", authMiddleware, logout);

router.get("/verify", authMiddleware, verify);

router.get("/refresh-token", refreshToken);

module.exports = router;
