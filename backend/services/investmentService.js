const mongoose = require("mongoose");
const Investment = require("../model/Investment");

// GET all investments for a user
const getInvestments = async (userId) => {
  const investments = await Investment.find({
    userId,
  }).sort({
    createdAt: -1,
  });

  return investments;
};

// CREATE investment
const createInvestment = async ({
  userId,
  symbol,
  companyName,
  investmentType,
  quantity,
  averageBuyPrice,
  purchaseDate,
  notes,
}) => {
  const investedAmount = quantity * averageBuyPrice;

  const investment = await Investment.create({
    userId,
    symbol: symbol.trim().toUpperCase(),
    companyName: companyName.trim(),
    investmentType,
    quantity,
    averageBuyPrice,
    investedAmount,
    purchaseDate,
    notes: notes ? notes.trim() : null,
  });

  return investment;
};

// UPDATE investment
const updateInvestment = async ({
  investmentId,
  userId,
  symbol,
  companyName,
  investmentType,
  quantity,
  averageBuyPrice,
  purchaseDate,
  notes,
}) => {
  if (!mongoose.Types.ObjectId.isValid(investmentId)) {
    const error = new Error("Invalid investment ID.");
    error.statusCode = 400;
    throw error;
  }

  // Important:
  // Find by BOTH investment ID and user ID.
  // This prevents one user from modifying another user's investment.
  const investment = await Investment.findOne({
    _id: investmentId,
    userId,
  });

  if (!investment) {
    const error = new Error("Investment not found.");
    error.statusCode = 404;
    throw error;
  }

  if (symbol !== undefined) {
    investment.symbol = symbol.trim().toUpperCase();
  }

  if (companyName !== undefined) {
    investment.companyName = companyName.trim();
  }

  if (investmentType !== undefined) {
    investment.investmentType = investmentType;
  }

  if (quantity !== undefined) {
    investment.quantity = quantity;
  }

  if (averageBuyPrice !== undefined) {
    investment.averageBuyPrice = averageBuyPrice;
  }

  if (purchaseDate !== undefined) {
    investment.purchaseDate = purchaseDate;
  }

  if (notes !== undefined) {
    investment.notes = notes ? notes.trim() : null;
  }

  // Recalculate whenever quantity or price changes.
  investment.investedAmount =
    investment.quantity * investment.averageBuyPrice;

  await investment.save();

  return investment;
};

// DELETE investment
const deleteInvestment = async ({
  investmentId,
  userId,
}) => {
  if (!mongoose.Types.ObjectId.isValid(investmentId)) {
    const error = new Error("Invalid investment ID.");
    error.statusCode = 400;
    throw error;
  }

  const investment = await Investment.findOneAndDelete({
    _id: investmentId,
    userId,
  });

  if (!investment) {
    const error = new Error("Investment not found.");
    error.statusCode = 404;
    throw error;
  }

  return investment;
};

module.exports = {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};