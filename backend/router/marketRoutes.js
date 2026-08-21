const express = require("express");

const { getQuote } = require("../controller/marketController");

const router = express.Router();

router.get("/quote/:symbol", getQuote);

module.exports = router;
