const express = require("express");

const authMiddleware = require("../middlewares/authorization");

const {
  createAlert,
  getAlerts,
  getActiveAlerts,
  deleteAlert,
  checkAlerts,
} = require("../controller/alertController");

const router = express.Router();

router.post("/", authMiddleware, createAlert);

router.get("/", authMiddleware, getAlerts);

router.get("/active", authMiddleware, getActiveAlerts);

router.get("/check", authMiddleware, checkAlerts);

router.delete("/:id", authMiddleware, deleteAlert);

module.exports = router;
