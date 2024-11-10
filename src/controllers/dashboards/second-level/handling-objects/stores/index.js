const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../../utils/db");

// processing creds
require("dotenv").config();

const stores_second_level_set_single_data_objects = async (req, res) => {
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
    const dashboards = await db.collection("dashboards").updateOne(query, {
      $set: {
        [`${pok}.${req.body.key_to_update}`]: req.body.value_to_update,
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
const stores_second_level_set_multiple_data_objects = async (req, res) => {
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
    const dashboards = await db.collection("dashboards").updateMany(query, {
      $set: {
        [`${pok}.${req.body.key_to_update}`]: req.body.value_to_update,
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
const stores_second_level_fetch_single_data_objects = async (req, res) => {
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
    const account = await db.collection("dashboards").findOne(query);

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
const stores_second_level_update_data_in_an_array = async (req, res) => {
  const { key, value, target_element_id, pok } = req.params;
  const { key_to_update, value_to_update } = req.body;
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

    const updateQuery = {
      $set: { [`${pok}.$[element].${key_to_update}`]: value_to_update },
    };

    const options = {
      arrayFilters: [{ "element._id": target_element_id }],
    };

    const result = await db
      .collection("dashboards")
      .updateOne(query, updateQuery, options);

    // Validate if the update was successful
    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Document updated successfully." });
    } else {
      res.status(404).json({ error: "Document or target element not found." });
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
      .collection("dashboards")
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
const stores_second_level_pull_multiple_data_from_an_array = async (
  req,
  res
) => {
  const { key, value, pok } = req.params;
  const { target_element_ids } = req.body;

  try {
    const db = await connectToDatabase();
    let query;

    if (key === "_id") {
      query = { [key]: new ObjectId(value) };
    } else {
      query = { [key]: value };
    }

    const deleteQuery = {
      $pull: { [pok]: { _id: { $in: target_element_ids } } },
    };

    const result = await db
      .collection("dashboards")
      .updateOne(query, deleteQuery);

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Elements deleted successfully." });
    } else {
      res.status(404).json({ error: "Document or target elements not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const stores_second_level_set_units_sold_data_object = async (req, res) => {
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

    // Find the document to get the current value of `units_sold`
    const document = await db.collection("dashboards").findOne(query);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Get the current value of `units_sold`, or initialize it to 0 if it doesn't exist
    let currentUnitsSold = document?.[pok]?.units_sold;

    // Initialize `units_sold` if it doesn't exist
    if (typeof currentUnitsSold !== "number") {
      currentUnitsSold = 0;
    }

    // Increment the current value by 1
    const newUnitsSold = currentUnitsSold + 1;

    // Update the document with the new value
    const updateResult = await db.collection("dashboards").updateOne(query, {
      $set: {
        [`${pok}.units_sold`]: newUnitsSold,
      },
    });

    if (updateResult.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Units sold updated successfully", newUnitsSold });
    } else {
      return res.status(404).json({ message: "Failed to update units_sold" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  stores_second_level_set_single_data_objects,
  stores_second_level_set_multiple_data_objects,
  stores_second_level_fetch_single_data_objects,
  stores_second_level_update_data_in_an_array,
  stores_second_level_pull_single_data_from_an_array,
  stores_second_level_set_units_sold_data_object,
  stores_second_level_pull_multiple_data_from_an_array,
};
