const FinancialProfile = require("../model/FinancialProfile");
const Expense = require("../model/Expense");
const Goal = require("../model/Goal");

const getFinancialHealth = async (req, res) => {
  try {
    const userId = req.id;

    // --------------------------------------------------
    // 1. Get financial profile
    // --------------------------------------------------

    const profile = await FinancialProfile.findOne({
      user: userId,
    }).select(
      "monthlyIncome emergencyFund totalDebt currentSavings existingInvestments",
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Financial profile not found",
      });
    }

    const monthlyIncome = profile.monthlyIncome || 0;

    // --------------------------------------------------
    // 2. Get current month's expenses
    // --------------------------------------------------

    const now = new Date();

    const year = Number(
      new Intl.DateTimeFormat("en", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
      }).format(now),
    );

    const month = Number(
      new Intl.DateTimeFormat("en", {
        timeZone: "Asia/Kolkata",
        month: "2-digit",
      }).format(now),
    );

    const startDate = new Date(
      Date.UTC(
        year,
        month - 1,
        1,
      ) -
        5.5 * 60 * 60 * 1000,
    );

    const endDate = new Date(
      Date.UTC(
        year,
        month - 1,
        new Date(
          Date.UTC(year, month, 0),
        ).getUTCDate() + 1,
      ) -
        5.5 * 60 * 60 * 1000,
    );

    const expenses = await Expense.find({
      user: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).select("amount category");

    const totalMonthlyExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );

    // --------------------------------------------------
    // 3. Calculate surplus and savings rate
    // --------------------------------------------------

    const monthlySurplus =
      monthlyIncome - totalMonthlyExpenses;

    let savingsRate = 0;

    if (monthlyIncome > 0) {
      savingsRate =
        (monthlySurplus / monthlyIncome) * 100;
    }

    // --------------------------------------------------
    // 4. Debt-to-income ratio
    // --------------------------------------------------

    let debtToIncomeRatio = 0;

    if (monthlyIncome > 0) {
      debtToIncomeRatio =
        (profile.totalDebt / monthlyIncome) * 100;
    }

    // --------------------------------------------------
    // 5. Emergency fund coverage
    // --------------------------------------------------

    let emergencyFundMonths = 0;

    if (totalMonthlyExpenses > 0) {
      emergencyFundMonths =
        profile.emergencyFund /
        totalMonthlyExpenses;
    }

    // --------------------------------------------------
    // 6. Goal analysis
    // --------------------------------------------------

    const goals = await Goal.find({
      user: userId,
      status: "active",
    }).select(
      "name targetAmount currentAmount targetDate priority",
    );

    let goalProgress = 0;

    if (goals.length > 0) {
      const totalTarget = goals.reduce(
        (total, goal) =>
          total + goal.targetAmount,
        0,
      );

      const totalCurrent = goals.reduce(
        (total, goal) =>
          total + goal.currentAmount,
        0,
      );

      if (totalTarget > 0) {
        goalProgress =
          (totalCurrent / totalTarget) * 100;
      }
    }

    // --------------------------------------------------
    // 7. Financial health score
    // --------------------------------------------------

    let score = 0;

    // Savings rate: maximum 30 points
    if (savingsRate >= 20) {
      score += 30;
    } else if (savingsRate >= 10) {
      score += 20;
    } else if (savingsRate > 0) {
      score += 10;
    }

    // Emergency fund: maximum 25 points
    if (emergencyFundMonths >= 6) {
      score += 25;
    } else if (emergencyFundMonths >= 3) {
      score += 20;
    } else if (emergencyFundMonths >= 1) {
      score += 10;
    }

    // Debt burden: maximum 20 points
    if (debtToIncomeRatio <= 20) {
      score += 20;
    } else if (debtToIncomeRatio <= 40) {
      score += 15;
    } else if (debtToIncomeRatio <= 60) {
      score += 8;
    }

    // Goal progress: maximum 15 points
    if (goalProgress >= 75) {
      score += 15;
    } else if (goalProgress >= 50) {
      score += 12;
    } else if (goalProgress >= 25) {
      score += 8;
    } else if (goalProgress > 0) {
      score += 4;
    }

    // Positive monthly surplus: maximum 10 points
    if (monthlySurplus > 0) {
      score += 10;
    }

    // --------------------------------------------------
    // 8. Determine health status
    // --------------------------------------------------

    let healthStatus;

    if (score >= 80) {
      healthStatus = "excellent";
    } else if (score >= 60) {
      healthStatus = "good";
    } else if (score >= 40) {
      healthStatus = "fair";
    } else {
      healthStatus = "poor";
    }

    // --------------------------------------------------
    // 9. Return response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      data: {
        healthScore: score,
        healthStatus,

        income: {
          monthly: monthlyIncome,
        },

        expenses: {
          monthly: Number(
            totalMonthlyExpenses.toFixed(2),
          ),
          transactionCount: expenses.length,
        },

        savings: {
          monthlySurplus: Number(
            monthlySurplus.toFixed(2),
          ),
          savingsRate: Number(
            savingsRate.toFixed(2),
          ),
        },

        debt: {
          totalDebt: profile.totalDebt,
          debtToIncomeRatio: Number(
            debtToIncomeRatio.toFixed(2),
          ),
        },

        emergencyFund: {
          amount: profile.emergencyFund,
          coverageMonths: Number(
            emergencyFundMonths.toFixed(2),
          ),
        },

        investments: {
          currentAmount:
            profile.existingInvestments,
        },

        goals: {
          activeGoals: goals.length,
          overallProgress: Number(
            Math.min(goalProgress, 100).toFixed(2),
          ),
        },
      },
    });
  } catch (error) {
    console.error(
      "Get Financial Health Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate financial health",
    });
  }
};

module.exports = {
  getFinancialHealth,
};