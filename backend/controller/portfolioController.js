const portfolioService = require("../services/portfolioService");

const addHolding = async (req, res) => {
  try {
    const userId = req.id;

    const {
      symbol,
      companyName,
      quantity,
      averageBuyPrice,
    } = req.body;

    const result =
      await portfolioService.addHolding({
        userId,
        symbol,
        companyName,
        quantity,
        averageBuyPrice,
      });

    return res.status(
      result.action === "created"
        ? 201
        : 200,
    ).json({
      success: true,
      message:
        result.action === "created"
          ? "Holding added successfully."
          : "Holding updated successfully.",
      data: result.holding,
    });
  } catch (error) {
    console.error(
      "Add portfolio holding error:",
      error.message,
    );

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const userId = req.id;

    const data =
      await portfolioService.getPortfolio(
        userId,
      );

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(
      "Get portfolio error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      error:
        "Unable to fetch portfolio.",
    });
  }
};

const getPortfolioSummary = async (
  req,
  res,
) => {
  try {
    const userId = req.id;

    const data =
      await portfolioService.getPortfolioSummary(
        userId,
      );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(
      "Portfolio summary error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      error:
        "Unable to calculate portfolio summary.",
    });
  }
};

const updateHolding = async (
  req,
  res,
) => {
  try {
    const userId = req.id;

    const { symbol } = req.params;

    const {
      quantity,
      averageBuyPrice,
      companyName,
    } = req.body;

    const result =
      await portfolioService.updateHolding({
        userId,
        symbol,
        quantity,
        averageBuyPrice,
        companyName,
      });

    if (result.error) {
      return res.status(
        result.statusCode || 400,
      ).json({
        success: false,
        error: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Portfolio holding updated successfully.",
      data: result.holding,
    });
  } catch (error) {
    console.error(
      "Update portfolio holding error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      error:
        "Unable to update portfolio holding.",
    });
  }
};

const removeHolding = async (
  req,
  res,
) => {
  try {
    const userId = req.id;

    const { symbol } = req.params;

    const result =
      await portfolioService.removeHolding({
        userId,
        symbol,
      });

    if (result.error) {
      return res.status(
        result.statusCode || 400,
      ).json({
        success: false,
        error: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Portfolio holding removed successfully.",
      data: result.holding,
    });
  } catch (error) {
    console.error(
      "Remove portfolio holding error:",
      error.message,
    );

    return res.status(500).json({
      success: false,
      error:
        "Unable to remove portfolio holding.",
    });
  }
};

module.exports = {
  addHolding,
  getPortfolio,
  getPortfolioSummary,
  updateHolding,
  removeHolding,
};