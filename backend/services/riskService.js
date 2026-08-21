const calculateRiskScore = ({
  volatility = null,
  beta = null,
  drawdown = null,
}) => {
  let score = 0;

  let factors = 0;

  if (typeof volatility === "number" && Number.isFinite(volatility)) {
    factors++;

    const volatilityScore = Math.min(Math.max(Math.abs(volatility), 0), 100);

    score += volatilityScore * 0.4;
  }

  if (typeof beta === "number" && Number.isFinite(beta)) {
    factors++;

    const betaScore = Math.min(Math.abs(beta) * 25, 100);

    score += betaScore * 0.3;
  }

  if (typeof drawdown === "number" && Number.isFinite(drawdown)) {
    factors++;

    const drawdownScore = Math.min(Math.max(Math.abs(drawdown), 0), 100);

    score += drawdownScore * 0.3;
  }

  if (factors === 0) {
    return {
      score: null,
      category: "UNKNOWN",
      explanation: "Insufficient market data to calculate risk.",
    };
  }

  score = Math.round(Math.min(Math.max(score, 0), 100));

  let category;

  if (score < 30) {
    category = "LOW";
  } else if (score < 60) {
    category = "MEDIUM";
  } else {
    category = "HIGH";
  }

  let explanation;

  if (category === "LOW") {
    explanation =
      "The available market indicators suggest relatively low risk.";
  } else if (category === "MEDIUM") {
    explanation = "The available market indicators suggest moderate risk.";
  } else {
    explanation =
      "The available market indicators suggest relatively high risk.";
  }

  return {
    score,
    category,
    explanation,
  };
};

module.exports = {
  calculateRiskScore,
};
