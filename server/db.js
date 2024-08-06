require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);

    console.log("connected to db successfully");
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
