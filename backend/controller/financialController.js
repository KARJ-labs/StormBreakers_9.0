const FinancialProfile = require("../model/FinancialProfile");

const getFinancialProfile = async (req, res) => {
  try {
    const profile = await FinancialProfile.findOne({
      user: req.id,
    }).select("-__v");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Financial profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get Financial Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch financial profile",
    });
  }
};

const createFinancialProfile = async (req, res) => {
  try {
    const existingProfile = await FinancialProfile.findOne({
      user: req.id,
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Financial profile already exists",
      });
    }

    const {
      monthlyIncome,
      monthlyEssentialExpenses,
      monthlyDiscretionaryExpenses,
      currentSavings,
      emergencyFund,
      existingInvestments,
      totalDebt,
      investmentAmount,
      investmentHorizon,
      riskTolerance,
      investmentObjective,
    } = req.body;

    const profile = await FinancialProfile.create({
      user: req.id,
      monthlyIncome,
      monthlyEssentialExpenses,
      monthlyDiscretionaryExpenses,
      currentSavings,
      emergencyFund,
      existingInvestments,
      totalDebt,
      investmentAmount,
      investmentHorizon,
      riskTolerance,
      investmentObjective,
    });

    return res.status(201).json({
      success: true,
      message: "Financial profile created successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Create Financial Profile Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid financial profile data",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create financial profile",
    });
  }
};

const updateFinancialProfile = async (req, res) => {
  try {
    const allowedFields = [
      "monthlyIncome",
      "monthlyEssentialExpenses",
      "monthlyDiscretionaryExpenses",
      "currentSavings",
      "emergencyFund",
      "existingInvestments",
      "totalDebt",
      "investmentAmount",
      "investmentHorizon",
      "riskTolerance",
      "investmentObjective",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const profile = await FinancialProfile.findOneAndUpdate(
      { user: req.id },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).select("-__v");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Financial profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Financial profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Update Financial Profile Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid financial profile data",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update financial profile",
    });
  }
};

module.exports = {
  getFinancialProfile,
  createFinancialProfile,
  updateFinancialProfile,
};