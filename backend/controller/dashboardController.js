const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    const userId = req.id;

    const data = await dashboardService.getDashboard(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get dashboard error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch dashboard data.",
    });
  }
};

module.exports = {
  getDashboard,
};
