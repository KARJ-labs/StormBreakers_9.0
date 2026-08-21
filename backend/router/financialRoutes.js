const express = require("express");

const authMiddleware = require("../middlewares/authorization");
const {
  getFinancialProfile,
createFinancialProfile,
    updateFinancialProfile,
} = require("../controller/financialController");

const router = express.Router();

router.get("/", authMiddleware, getFinancialProfile);
router.post("/", authMiddleware, createFinancialProfile);
router.put("/", authMiddleware, updateFinancialProfile);
module.exports = router;