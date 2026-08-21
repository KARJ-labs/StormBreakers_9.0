const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected successfully. Host: ${connection.connection.host}`,
    );
  } catch (err) {
    console.error("MongoDB connection error:", err.message);

    throw err;
  }
};

module.exports = connectDB;
