require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const connectDB = require("./db");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./Routes/EmployeeSignUpRoutes");
const leaveRoutes = require("./Routes/LeaveRequestRoutes");

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "../client/build");
app.use(express.static(buildpath));

// Home route
app.get("/", (req, res) => {
  res.send("Hello, welcome to the Exine server!");
});

app.use("/user", userRoutes);
app.use("/leave", leaveRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
