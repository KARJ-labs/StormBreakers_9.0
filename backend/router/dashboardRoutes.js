const express = require("express");

const authMiddleware = require("../middlewares/authorization");

const { getDashboard } = require("../controller/dashboardController");

const router = express.Router();

router.get("/", authMiddleware, getDashboard);

module.exports = router;
