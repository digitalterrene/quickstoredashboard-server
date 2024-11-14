const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("./db");
const { ObjectId } = require("mongodb");
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

const send_unauthorized_error = (res, message) => {
  return res.status(401).json({ error: `Unauthorized Access - ${message}` });
};
const authenticate_participant = async (req, res, next) => {
  const { participant_category, participant_id } = req.headers;
  const { key, value } = req.params;

  if (["GET", "PUT", "DELETE"].includes(req.method)) {
    // Check for the Authorization header
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) return send_unauthorized_error(res, "Token missing");

    if (!participant_id)
      return send_unauthorized_error(res, "Participant Id is required");

    try {
      // Verify the token and check participant ID
      const decoded = verifyToken(token);

      if (participant_id !== decoded?._id) {
        return send_unauthorized_error(
          res,
          "Token provided does not belong to the currently logged-in user"
        );
      }

      // Fetch dashboard
      const db = await connectToDatabase();
      const query =
        key === "_id" ? { [key]: new ObjectId(value) } : { [key]: value };
      const dashboard = await db.collection("dashboards").findOne(query);
      const participation_list = [
        "management",
        "employees",
        "participants",
        "participations",
        "legal_stakeholders",
      ];
      // Check if participant_id matches the _id of the dashboard
      if (
        dashboard._id.equals(new ObjectId(participant_id)) ||
        dashboard._id.equals(participant_id)
      ) {
        // Participant is the owner of the dashboard, allow access
        return next();
      }

      // Iterate through participation_list elements
      for (const participation_key of participation_list) {
        const array_list = dashboard[participation_key] || [];

        // Check if participant_id exists in the current array_list
        const exists = array_list.some(
          (element) =>
            element?._id === new ObjectId(participant_id) || participant_id
        );

        if (exists) {
          // Participant found in this participation_key, allow access
          return next();
        }
      }

      // If participant_id is not found in any participation_key, deny access
      return send_unauthorized_error(
        res,
        "You are trying to access information whose dashboard you are not a participant of"
      );
    } catch (error) {
      return send_unauthorized_error(res, "Invalid token");
    }
  } else {
    next();
  }
};

module.exports = {
  authenticate_participant,
};
