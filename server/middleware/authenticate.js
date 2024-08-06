const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticate = (req, res, next) => {
  const authHeader = req.header("Authorization") || req.header("auth-token");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Access Denied: Malformed token" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    console.log("User verified:", verified); // Add this line for debugging
    req.user = verified; // Set the decoded payload to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = authenticate;
