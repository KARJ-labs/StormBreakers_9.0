const companyService = require("../services/companyService");

const getCompanyDetails = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: "Company symbol is required.",
      });
    }

    const company = await companyService.getCompanyDetails(symbol);

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Get company details error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch company details.",
    });
  }
};

const getCompanyMetrics = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: "Company symbol is required.",
      });
    }

    const metrics = await companyService.getCompanyMetrics(symbol);

    return res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Get company metrics error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch company metrics.",
    });
  }
};

const getCompanyHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { resolution, from, to } = req.query;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: "Company symbol is required.",
      });
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        error: "from and to timestamps are required.",
      });
    }

    const history = await companyService.getCompanyHistory(
      symbol,
      resolution || "D",
      from,
      to,
    );

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get company history error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to fetch company history.",
    });
  }
};

const getCompanyRisk = async (req, res) => {
  try {
    const { symbol } = req.params;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: "Company symbol is required.",
      });
    }

    const risk = await companyService.getCompanyRisk(symbol);

    return res.status(200).json({
      success: true,
      data: risk,
    });
  } catch (error) {
    console.error("Get company risk error:", error.message);

    return res.status(502).json({
      success: false,
      error: "Unable to calculate company risk.",
    });
  }
};

module.exports = {
  getCompanyDetails,
  getCompanyMetrics,
  getCompanyHistory,
  getCompanyRisk,
};
