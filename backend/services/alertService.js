const Alert = require("../model/alert");
const marketService = require("./marketService");

const createAlert = async ({ userId, symbol, condition, targetPrice }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!symbol || typeof symbol !== "string") {
    throw new Error("Stock symbol is required");
  }

  const normalizedSymbol = symbol.trim().toUpperCase();

  const normalizedCondition =
    typeof condition === "string" ? condition.trim().toUpperCase() : "";

  if (!["ABOVE", "BELOW"].includes(normalizedCondition)) {
    throw new Error("Condition must be ABOVE or BELOW");
  }

  if (
    typeof targetPrice !== "number" ||
    !Number.isFinite(targetPrice) ||
    targetPrice <= 0
  ) {
    throw new Error("Target price must be greater than zero");
  }

  const alert = await Alert.create({
    userId,
    symbol: normalizedSymbol,
    condition: normalizedCondition,
    targetPrice,
    isActive: true,
  });

  return alert;
};

const getUserAlerts = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return Alert.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();
};

const getActiveAlerts = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return Alert.find({
    userId,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();
};

const deleteAlert = async ({ userId, alertId }) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!alertId) {
    throw new Error("Alert ID is required");
  }

  const alert = await Alert.findOneAndDelete({
    _id: alertId,
    userId,
  });

  if (!alert) {
    return {
      error: true,
      statusCode: 404,
      message: "Alert not found.",
    };
  }

  return {
    error: false,
    data: alert,
  };
};

const checkAlert = async (alert) => {
  const quote = await marketService.getQuote(alert.symbol);

  const currentPrice = quote.currentPrice;

  if (typeof currentPrice !== "number" || !Number.isFinite(currentPrice)) {
    return {
      alertId: alert._id,
      symbol: alert.symbol,
      triggered: false,
      currentPrice: null,
    };
  }

  let triggered = false;

  if (alert.condition === "ABOVE" && currentPrice >= alert.targetPrice) {
    triggered = true;
  }

  if (alert.condition === "BELOW" && currentPrice <= alert.targetPrice) {
    triggered = true;
  }

  if (triggered) {
    await Alert.findOneAndUpdate(
      {
        _id: alert._id,
        userId: alert.userId,
        isActive: true,
      },
      {
        $set: {
          isActive: false,
          triggeredAt: new Date(),
          triggeredPrice: currentPrice,
        },
      },
      {
        returnDocument: "after",
      },
    );
  }

  return {
    alertId: alert._id,
    symbol: alert.symbol,
    condition: alert.condition,
    targetPrice: alert.targetPrice,
    currentPrice,
    triggered,
  };
};

const checkUserAlerts = async (userId) => {
  const alerts = await getActiveAlerts(userId);

  const results = [];

  for (const alert of alerts) {
    try {
      const result = await checkAlert(alert);

      results.push(result);
    } catch (error) {
      results.push({
        alertId: alert._id,
        symbol: alert.symbol,
        triggered: false,
        error: "Unable to check current market price.",
      });
    }
  }

  return results;
};

module.exports = {
  createAlert,
  getUserAlerts,
  getActiveAlerts,
  deleteAlert,
  checkUserAlerts,
};
