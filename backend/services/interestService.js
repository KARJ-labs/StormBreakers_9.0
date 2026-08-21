const UserInterest = require("../model/UserInterest");

// ============================================================
// GET ALL INTERESTS
// ============================================================

const getInterests = async (userId) => {
  const interests = await UserInterest.find({
    userId,
  }).sort({
    createdAt: -1,
  });

  return interests;
};

// ============================================================
// CREATE INTEREST
// ============================================================

const createInterest = async ({
  userId,
  symbol,
  companyName,
  destinationPlatform,
}) => {
  const normalizedSymbol = symbol.trim().toUpperCase();

  // Prevent duplicate interest for the same company
  // for the same user.
  const existingInterest = await UserInterest.findOne({
    userId,
    symbol: normalizedSymbol,
  });

  if (existingInterest) {
    const error = new Error(
      "Interest for this company already exists."
    );

    error.statusCode = 409;

    throw error;
  }

  const interest = await UserInterest.create({
    userId,
    symbol: normalizedSymbol,
    companyName: companyName.trim(),
    destinationPlatform: destinationPlatform.trim(),
  });

  return interest;
};

// ============================================================
// DELETE INTEREST
// ============================================================

const deleteInterest = async ({
  userId,
  symbol,
}) => {
  const normalizedSymbol = symbol.trim().toUpperCase();

  const interest = await UserInterest.findOneAndDelete({
    userId,
    symbol: normalizedSymbol,
  });

  if (!interest) {
    const error = new Error("Interest not found.");

    error.statusCode = 404;

    throw error;
  }

  return interest;
};

module.exports = {
  getInterests,
  createInterest,
  deleteInterest,
};