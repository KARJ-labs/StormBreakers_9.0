const calculateRiskScore = ({ volatility, beta, drawdown }) => {
  let score = 0;

  if (typeof volatility === "number") {
    if (volatility >= 50) {
      score += 40;
    } else if (volatility >= 30) {
      score += 30;
    } else if (volatility >= 15) {
      score += 20;
    } else {
      score += 10;
    }
  }

  if (typeof beta === "number") {
    if (beta >= 1.5) {
      score += 35;
    } else if (beta >= 1) {
      score += 25;
    } else if (beta >= 0.5) {
      score += 15;
    } else {
      score += 10;
    }
  }

  if (typeof drawdown === "number") {
    const absoluteDrawdown = Math.abs(drawdown);

    if (absoluteDrawdown >= 40) {
      score += 25;
    } else if (absoluteDrawdown >= 20) {
      score += 20;
    } else if (absoluteDrawdown >= 10) {
      score += 15;
    } else {
      score += 5;
    }
  }

  score = Math.min(score, 100);

  let category;
  let explanation;

  if (score >= 70) {
    category = "HIGH";
    explanation =
      "The company shows relatively high market risk based on volatility, beta, and drawdown.";
  } else if (score >= 40) {
    category = "MEDIUM";
    explanation =
      "The company shows moderate market risk based on the available risk indicators.";
  } else {
    category = "LOW";
    explanation =
      "The company shows relatively lower market risk based on the available indicators.";
  }

  return {
    score,
    category,
    explanation,
    disclaimer:
      "This risk score is an informational estimate and is not financial advice.",
  };
};

module.exports = {
  calculateRiskScore,
};
