const investmentService = require("../services/investmentService");

// ============================================================
// GET /api/v1/investments
// ============================================================

const getInvestments = async (req, res) => {
  try {
    const investments = await investmentService.getInvestments(
      req.id
    );

    return res.status(200).json({
      success: true,
      data: investments,
    });
  } catch (error) {
    console.error("getInvestments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch investments.",
    });
  }
};

// ============================================================
// POST /api/v1/investments
// ============================================================

const createInvestment = async (req, res) => {
  try {
    const {
      symbol,
      companyName,
      investmentType,
      quantity,
      averageBuyPrice,
      purchaseDate,
      notes,
    } = req.body;

    // Required fields
    if (
      !symbol ||
      !companyName ||
      !investmentType ||
      quantity === undefined ||
      averageBuyPrice === undefined ||
      !purchaseDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Required investment fields are missing.",
      });
    }

    // Validate quantity
    if (
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a number greater than 0.",
      });
    }

    // Validate price
    if (
      typeof averageBuyPrice !== "number" ||
      averageBuyPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "averageBuyPrice must be a number greater than or equal to 0.",
      });
    }

    const investment =
      await investmentService.createInvestment({
        userId: req.id,
        symbol,
        companyName,
        investmentType,
        quantity,
        averageBuyPrice,
        purchaseDate,
        notes,
      });

    return res.status(201).json({
      success: true,
      message: "Investment created successfully.",
      data: investment,
    });
  } catch (error) {
    console.error("createInvestment error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to create investment.",
    });
  }
};

// ============================================================
// PUT /api/v1/investments/:id
// ============================================================

const updateInvestment = async (req, res) => {
  try {
    const {
      symbol,
      companyName,
      investmentType,
      quantity,
      averageBuyPrice,
      purchaseDate,
      notes,
    } = req.body;

    // Validate quantity only if provided
    if (quantity !== undefined) {
      if (
        typeof quantity !== "number" ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quantity must be a number greater than 0.",
        });
      }
    }

    // Validate price only if provided
    if (averageBuyPrice !== undefined) {
      if (
        typeof averageBuyPrice !== "number" ||
        averageBuyPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "averageBuyPrice must be a number greater than or equal to 0.",
        });
      }
    }

    // At least one field should be provided
    if (
      symbol === undefined &&
      companyName === undefined &&
      investmentType === undefined &&
      quantity === undefined &&
      averageBuyPrice === undefined &&
      purchaseDate === undefined &&
      notes === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update.",
      });
    }

    const investment =
      await investmentService.updateInvestment({
        investmentId: req.params.id,
        userId: req.id,
        symbol,
        companyName,
        investmentType,
        quantity,
        averageBuyPrice,
        purchaseDate,
        notes,
      });

    return res.status(200).json({
      success: true,
      message: "Investment updated successfully.",
      data: investment,
    });
  } catch (error) {
    console.error("updateInvestment error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to update investment.",
    });
  }
};

// ============================================================
// DELETE /api/v1/investments/:id
// ============================================================

const deleteInvestment = async (req, res) => {
  try {
    const investment =
      await investmentService.deleteInvestment({
        investmentId: req.params.id,
        userId: req.id,
      });

    return res.status(200).json({
      success: true,
      message: "Investment deleted successfully.",
      data: investment,
    });
  } catch (error) {
    console.error("deleteInvestment error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Failed to delete investment.",
    });
  }
};

module.exports = {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
};