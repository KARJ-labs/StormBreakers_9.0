const express = require("express");

const authMiddleware = require("../middlewares/authorization");
const validateRequest = require("../middlewares/validateRequest");

const { validateAddWatchlist } = require("../validators/watchlistValidator");

const {
  addToWatchlist,
  getUserWatchlist,
  removeFromWatchlist,
  checkWatchlist,
} = require("../controller/watchlistController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest(validateAddWatchlist),
  addToWatchlist,
);

router.get("/", authMiddleware, getUserWatchlist);

router.delete("/:symbol", authMiddleware, removeFromWatchlist);

router.get("/check/:symbol", authMiddleware, checkWatchlist);

module.exports = router;
