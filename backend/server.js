require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const profileRoutes = require("./router/profileRoutes");
const connectDB = require("./config/db");
const authentication = require("./router/userAuth");
const googleAuthRoutes = require("./router/googleAuthRouter");
const marketRoutes = require("./router/marketRoutes");
const companyRoutes = require("./router/companyRoutes");
const watchlistRoutes = require("./router/watchlistRoutes");
const financialRoutes = require("./router/financialRoutes");
const expenseRoutes = require("./router/expenseRoutes");
const portfolioRoutes = require("./router/portfolioRoutes");
const alertRoutes = require("./router/alertRouter");
const dashboardRoutes = require("./router/dashboardRoutes");
const errorHandler = require("./middlewares/errorHandler");
const goalRoutes = require("./router/goalRoutes");
const financialHealthRoutes = require("./router/financialHealthRoutes");
const helmet = require("helmet");
const investmentRoutes = require("./router/investmentRoutes");
const interestRoutes = require("./router/interestRoutes");
const companyAnalyzerRoutes = require("./router/companyAnalyzerRoutes");

const app = express();
app.use(helmet());

const port = process.env.PORT || 5000;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authentication);
app.use("/api/v1/auth", googleAuthRoutes);
app.use("/api/v1/market", marketRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/watchlist", watchlistRoutes);
app.use("/api/v1/financial-profile", financialRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/portfolio", portfolioRoutes);
app.use("/api/v1/alerts", alertRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/goals", goalRoutes);
app.use("/api/v1/financial-health", financialHealthRoutes);
app.use("/api/v1/investments", investmentRoutes);
app.use("/api/v1/interests", interestRoutes);
app.use("/api/v1/company-analyzer", companyAnalyzerRoutes);

app.get("/", (req, res) => {
  res.status(200).send("hello from server");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Router not found.",
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB service:", err.message);
    process.exit(1);
  }
};

startServer();
