const { GoogleGenAI, Type } = require("@google/genai");

const FinancialProfile = require("../model/FinancialProfile");
const Expense = require("../model/Expense");
const Goal = require("../model/Goal");

const {
  buildCompanyAnalyzerPrompt,
} = require("../utils/companyAnalyzerPrompt");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getMonthlyExpenseSummary = async (userId) => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(now);

  const dateParts = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      dateParts[part.type] = part.value;
    }
  }

  const year = Number(dateParts.year);
  const month = Number(dateParts.month);
  const day = Number(dateParts.day);

  const startDate = new Date(
    Date.UTC(year, month - 1, 1) -
      5.5 * 60 * 60 * 1000,
  );

  const endDate = new Date(
    Date.UTC(year, month - 1, day + 1) -
      5.5 * 60 * 60 * 1000,
  );

  const expenses = await Expense.find({
    user: userId,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  }).select("amount category");

  const totalSpending = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  const categoryBreakdown = {};

  for (const expense of expenses) {
    categoryBreakdown[expense.category] =
      (categoryBreakdown[expense.category] || 0) +
      expense.amount;
  }

  return {
    totalSpending,
    transactionCount: expenses.length,
    categoryBreakdown,
  };
};

const analyzeCompany = async (req, res) => {
  try {
    const { question, company } = req.body;

    if (
      !question ||
      typeof question !== "string" ||
      !question.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (!company || typeof company !== "object") {
      return res.status(400).json({
        success: false,
        message: "Company information is required",
      });
    }

    if (!company.symbol) {
      return res.status(400).json({
        success: false,
        message: "Company symbol is required",
      });
    }

    const userId = req.id;

    const [
      financialProfile,
      expenseSummary,
      goals,
    ] = await Promise.all([
      FinancialProfile.findOne({
        user: userId,
      }).lean(),

      getMonthlyExpenseSummary(userId),

      Goal.find({
        user: userId,
        status: "active",
      })
        .select(
          "name targetAmount currentAmount targetDate category priority",
        )
        .lean(),
    ]);

    if (!financialProfile) {
      return res.status(404).json({
        success: false,
        message:
          "Financial profile is required before using the company analyzer",
      });
    }

    const monthlyIncome =
      financialProfile.monthlyIncome || 0;

    const monthlyExpenses =
      expenseSummary.totalSpending || 0;

    const monthlySurplus =
      monthlyIncome - monthlyExpenses;

    const savingsRate =
      monthlyIncome > 0
        ? (monthlySurplus / monthlyIncome) * 100
        : 0;

    const totalDebt =
      financialProfile.totalDebt || 0;

    const debtToIncomeRatio =
      monthlyIncome > 0
        ? (totalDebt / monthlyIncome) * 100
        : 0;

    const emergencyFund =
      financialProfile.emergencyFund || 0;

    const emergencyFundMonths =
      monthlyExpenses > 0
        ? emergencyFund / monthlyExpenses
        : 0;

    const totalGoalTarget = goals.reduce(
      (total, goal) => total + goal.targetAmount,
      0,
    );

    const totalGoalCurrent = goals.reduce(
      (total, goal) => total + goal.currentAmount,
      0,
    );

    const goalProgress =
      totalGoalTarget > 0
        ? (totalGoalCurrent / totalGoalTarget) * 100
        : 0;

    const financialHealth = {
      monthlyIncome,
      monthlyExpenses,
      monthlySurplus,
      savingsRate: Number(savingsRate.toFixed(2)),
      totalDebt,
      debtToIncomeRatio: Number(
        debtToIncomeRatio.toFixed(2),
      ),
      emergencyFund,
      emergencyFundMonths: Number(
        emergencyFundMonths.toFixed(2),
      ),
      activeGoals: goals.length,
      overallGoalProgress: Number(
        Math.min(goalProgress, 100).toFixed(2),
      ),
    };

    const prompt = buildCompanyAnalyzerPrompt({
      question: question.trim(),
      company,
      financialProfile,
      expenseSummary,
      goals,
      financialHealth,
    });

    const response = await ai.models.generateContent({
      model:
        process.env.GEMINI_MODEL ||
        "gemini-2.5-flash",

      contents: prompt,

      config: {
        temperature: 0.3,
        maxOutputTokens: 1200,

        responseMimeType: "application/json",

        responseSchema: {
          type: Type.OBJECT,

          properties: {
            summary: {
              type: Type.STRING,
            },

            suitability: {
              type: Type.STRING,
            },

            whyItMayFit: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },

            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },

            financialImpact: {
              type: Type.STRING,
            },

            goalImpact: {
              type: Type.STRING,
            },

            keyConsiderations: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },

          required: [
            "summary",
            "suitability",
            "whyItMayFit",
            "risks",
            "financialImpact",
            "goalImpact",
            "keyConsiderations",
          ],
        },
      },
    });

    let analysis;

    try {
      analysis = JSON.parse(response.text);
    } catch (parseError) {
      console.error(
        "Gemini JSON Parse Error:",
        parseError,
      );

      return res.status(502).json({
        success: false,
        message:
          "AI returned an invalid analysis format",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        company: {
          symbol: company.symbol,
          name: company.name || null,
        },

        question: question.trim(),

        analysis,

        disclaimer:
          "This analysis is educational and based only on the information supplied to the analyzer. It is not a guarantee of returns or personalized financial advice.",
      },
    });
  } catch (error) {
    console.error(
      "Company Analyzer Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to analyze company",
    });
  }
};

module.exports = {
  analyzeCompany,
};