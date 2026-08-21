const express = require("express");

const authMiddleware = require("../middlewares/authorization");
const validateRequest = require("../middlewares/validateRequest");

const { validateCreateAlert } = require("../validators/alertValidator");

const {
  createAlert,
  getAlerts,
  getActiveAlerts,
  deleteAlert,
  checkAlerts,
} = require("../controller/alertController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest(validateCreateAlert),
  createAlert,
);

router.get("/", authMiddleware, getAlerts);

router.get("/active", authMiddleware, getActiveAlerts);

router.get("/check", authMiddleware, checkAlerts);

router.delete("/:id", authMiddleware, deleteAlert);

module.exports = router;
