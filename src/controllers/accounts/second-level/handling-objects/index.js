const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../utils/db");

// processing creds
require("dotenv").config();

const second_level_set_single_data_objects = async (req, res) => {
  const { key, value, pok } = req.params;
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
    const accounts = await db.collection("accounts").updateOne(query, {
      $set: {
        [`${pok}.${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (accounts) {
      return res.status(200).json(accounts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const second_level_set_multiple_data_objects = async (req, res) => {
  const { key, value, pok } = req.params;
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
    const accounts = await db.collection("accounts").updateMany(query, {
      $set: {
        [`${pok}.${req.body.key_to_update}`]: req.body.value_to_update,
      },
    });
    //Validate the required fields before creating the dashboard
    if (accounts) {
      return res.status(200).json(accounts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const second_level_fetch_single_data_objects = async (req, res) => {
  const { key, value, pok, keyn_req } = req.params;
  //keyn_req is short for key_in_requeste
  //it is the key that has the data we are requesting
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
    const account = await db.collection("accounts").findOne(query);

    //Validate the required fields before creating the dashboard
    if (account && account[pok][keyn_req]) {
      return res.status(200).json(account[pok][keyn_req]);
    } else {
      res.status(404).json({ error: `Data not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const stores_second_level_pull_single_data_from_an_array = async (req, res) => {
  const { key, value, target_element_id, pok } = req.params;
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

    // Construct the delete query dynamically based on the target array (pok)
    const deleteQuery = {
      $pull: { [pok]: { _id: target_element_id } },
    };

    const result = await db
      .collection("accounts")
      .updateOne(query, deleteQuery);

    // Validate if the update was successful
    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Element deleted successfully." });
    } else {
      res.status(404).json({ error: "Document or target element not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  second_level_set_single_data_objects,
  second_level_set_multiple_data_objects,
  stores_second_level_pull_single_data_from_an_array,
  second_level_fetch_single_data_objects,
};
