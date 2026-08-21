const alertService = require("../services/alertService");

const createAlert = async (req, res) => {
  try {
    const userId = req.id;

    const { symbol, condition, targetPrice } = req.body;

    const data = await alertService.createAlert({
      userId,
      symbol,
      condition,
      targetPrice,
    });

    return res.status(201).json({
      success: true,
      message: "Alert created successfully.",
      data,
    });
  } catch (error) {
    console.error("Create alert error:", error.message);

    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getAlerts = async (req, res) => {
  try {
    const userId = req.id;

    const data = await alertService.getUserAlerts(userId);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get alerts error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch alerts.",
    });
  }
};

const getActiveAlerts = async (req, res) => {
  try {
    const userId = req.id;

    const data = await alertService.getActiveAlerts(userId);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get active alerts error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to fetch active alerts.",
    });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const userId = req.id;

    const { id } = req.params;

    const result = await alertService.deleteAlert({
      userId,
      alertId: id,
    });

    if (result.error) {
      return res.status(result.statusCode || 400).json({
        success: false,
        error: result.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert deleted successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("Delete alert error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to delete alert.",
    });
  }
};

const checkAlerts = async (req, res) => {
  try {
    const userId = req.id;

    const data = await alertService.checkUserAlerts(userId);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Check alerts error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Unable to check alerts.",
    });
  }
};

module.exports = {
  createAlert,
  getAlerts,
  getActiveAlerts,
  deleteAlert,
  checkAlerts,
};
