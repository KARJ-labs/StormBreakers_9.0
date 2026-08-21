const express = require("express");

const authMiddleware = require("../middlewares/authorization");
const { getProfile } = require("../controller/userProfileController");

const router = express.Router();

router.get("/", authMiddleware, getProfile);

module.exports = router;