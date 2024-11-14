const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, `${process.env.SECRET}`);
    //console.log("Token decoded:", decoded);
    return decoded;
  } catch (error) {
    //console.error("Token verification error:", error);
    throw new Error("Invalid token");
  }
};

const authenticate_fetch_user_req = async (req, res, next) => {
  const { quickstoredashboard_account_user_id } = req.headers;

  if (req.method === "GET") {
    // Check for the Authorization header
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - Token missing" });
    }

    if (!quickstoredashboard_account_user_id) {
      return res
        .status(401)
        .json({ error: "Unauthorized Access - User Id is required" });
    }

    try {
      verifyToken(token);
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }
  } else {
    return res.status(401).json({ error: "Unauthorized - Method not allowed" });
  }
};

module.exports = authenticate_fetch_user_req;
