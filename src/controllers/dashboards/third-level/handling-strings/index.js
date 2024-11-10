const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../utils/db");
// parent object key ------------> pok
// processing creds
require("dotenv").config();

const third_level_set_single_data_strings = async (req, res) => {
  const { key, value, _pok, pok } = req.params;
  try {
    const db = await connectToDatabase();
    let query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }
    const dashboards = await db.collection("dashboards").updateOne(query, {
      $set: {
        [`${_pok}.${pok}.${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (dashboards) {
      return res.status(200).json(dashboards);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const third_level_set_multiple_data_strings = async (req, res) => {
  const { key, value, pok, _pok } = req.params;
  try {
    const db = await connectToDatabase();
    let query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }
    const dashboards = await db.collection("dashboards").updateMany(query, {
      $set: {
        [`${_pok}.${pok}.${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (dashboards) {
      return res.status(200).json(dashboards);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  third_level_set_single_data_strings,
  third_level_set_multiple_data_strings,
};
