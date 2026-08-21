const interestService = require("../services/interestService");

// ============================================================
// GET /api/v1/interests
// ============================================================

const getInterests = async (req, res) => {
  try {
    const interests = await interestService.getInterests(
      req.id
    );

    return res.status(200).json({
      success: true,
      data: interests,
    });
  } catch (error) {
    console.error("getInterests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interests.",
    });
  }
};

// ============================================================
// POST /api/v1/interests
// ============================================================

const createInterest = async (req, res) => {
  try {
    const {
      symbol,
      companyName,
      destinationPlatform,
    } = req.body;

    // Validate required fields
    if (
      !symbol ||
      !companyName ||
      !destinationPlatform
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Symbol, companyName and destinationPlatform are required.",
      });
    }

    const interest =
      await interestService.createInterest({
        userId: req.id,
        symbol,
        companyName,
        destinationPlatform,
      });

    return res.status(201).json({
      success: true,
      message: "Interest recorded successfully.",
      data: interest,
    });
  } catch (error) {
    console.error("createInterest error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to create interest.",
    });
  }
};

// ============================================================
// DELETE /api/v1/interests/:symbol
// ============================================================

const deleteInterest = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol || !symbol.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company symbol is required.",
      });
    }

    const interest =
      await interestService.deleteInterest({
        userId: req.id,
        symbol,
      });

    return res.status(200).json({
      success: true,
      message: "Interest deleted successfully.",
      data: interest,
    });
  } catch (error) {
    console.error("deleteInterest error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to delete interest.",
    });
  }
};

module.exports = {
  getInterests,
  createInterest,
  deleteInterest,
};