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
const goalRoutes = require("./router/goalRoutes");

const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
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

app.get("/", (req, res) => {
  res.status(200).send("hello from server");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Router not found.",
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  res.status(500).json({
    message: "Something went wrong on the server!",
  });
});

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
