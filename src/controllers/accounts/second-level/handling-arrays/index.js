const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../utils/db");

const bcrypt = require("bcryptjs");
// processing creds
require("dotenv").config();

const second_level_add_to_set_single_data_arrays = async (req, res) => {
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
      $addToSet: {
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
const second_level_add_to_set_multiple_data_arrays = async (req, res) => {
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
      $addToSet: {
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
const second_level_pull_multiple_data_arrays = async (req, res) => {
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
      $pull: {
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
const second_level_pull_single_data_arrays = async (req, res) => {
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
      $pull: {
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
const second_level_update_entry_in_a_single_data_array = async (req, res) => {
  const { key, _key, _value, value, pok } = req.params;
  const { account_type } = req.headers;
  try {
    const db = await connectToDatabase();

    // Validate that and updatedData are provided
    if (!req.body.value_to_update || !_key || !_value) {
      return res.status(400).json({ error: "Missing fields required" });
    }

    // Create a dynamic query
    let query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }
    if (!account_type) {
      return res
        .status(400)
        .json({ error: "Please provide the account type of the user" });
    }
    // First, we fetch the user in the folder
    let stakeholder_obj = await db
      .collection("accounts")
      .findOne({ email: req.body.value_to_update?.email });

    if (account_type === "basic_user") {
      const admin_request = await fetch(
        `https://server.account.quickstoredashboard.com/accounts/fetch-single-user/admin-access/email/${req.body.value_to_update?.email}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            quickstoredashboard_ecosystem_admin: "dashboards",
            requested_data: JSON.stringify([
              "_id",
              "email",
              "status",
              "image",
              "name",
              "username",
              "firstname",
              "lastname",
              "access_key",
            ]),
          },
        }
      );
      const admin_json = await admin_request.json();

      if (admin_request.ok) {
        if (admin_json?.email) {
          stakeholder_obj = admin_json;
        }
      } else {
        return res.status(404).json({
          error: `User intented to be updated with, not found. Server's error`,
        });
      }
    } else if (account_type === "admin_dashboard") {
      stakeholder_obj = await db
        .collection("dashboards")
        .findOne({ email: req.body.value_to_update?.email });
    } else {
      stakeholder_obj = await db
        .collection("accounts")
        .findOne({ email: req.body.value_to_update?.email });
    }

    if (stakeholder_obj) {
      // If we find the user, we check if the access key provided is correct
      if (req.body?.update_method === "refresh") {
        const updateResult = await db.collection("accounts").updateOne(
          { ...query, [`${pok}._id`]: stakeholder_obj?._id },
          {
            $set: {
              [`${pok}.$.email`]: stakeholder_obj?.email,
              [`${pok}.$.status`]: stakeholder_obj?.status,
              [`${pok}.$.image`]: stakeholder_obj?.image,
              [`${pok}.$.name`]: stakeholder_obj?.name,
              [`${pok}.$.username`]: stakeholder_obj?.username,
              [`${pok}.$.firstname`]: stakeholder_obj?.firstname,
              [`${pok}.$.lastname`]: stakeholder_obj?.lastname,
              [`${pok}.$._id`]: new ObjectId(stakeholder_obj?._id),
              [`${pok}.$.access_key`]: stakeholder_obj?.access_key,
            },
          }
        );

        if (updateResult.modifiedCount > 0) {
          return res.status(200).json({
            message: `Successfully updated element with ${_key}:${_value} in ${pok}`,
          });
        } else {
          return res.status(200).json({
            error: `The data is up to date`,
          });
        }
      } else {
        if (
          stakeholder_obj?.access_key !== req.body.value_to_update?.access_key
        ) {
          res.status(400).json({ error: "Wrong Access key" });
        }
        if (
          stakeholder_obj.access_key === req.body.value_to_update?.access_key
        ) {
          const { access_key, ...otherKeysValuePairs } =
            req.body.value_to_update;
          const updateResult = await db.collection("accounts").updateOne(
            { ...query, [`${pok}._id`]: new ObjectId(stakeholder_obj?._id) },
            {
              $set: {
                [`${pok}.$.email`]: stakeholder_obj?.email,
                [`${pok}.$.status`]: stakeholder_obj?.status,
                [`${pok}.$.image`]: stakeholder_obj?.image,
                [`${pok}.$.name`]: stakeholder_obj?.name,
                [`${pok}.$._id`]: new ObjectId(stakeholder_obj?._id),
                [`${pok}.$.share_access_key`]:
                  req.body.value_to_update?.share_access_key,
                [`${pok}.$.share_biometrics`]:
                  req.body.value_to_update?.share_biometric,
                [`${pok}.$.share_id`]: req.body.value_to_update?.share_id,
                [`${pok}.$.share_password`]:
                  req.body.value_to_update?.share_password,
                [`${pok}.$.share_security_key`]:
                  req.body.value_to_update?.share_security_key,
              },
            }
          );

          if (updateResult.modifiedCount > 0) {
            return res.status(200).json({
              message: `Successfully updated element with ${_key}:${_value} in ${pok}`,
            });
          } else {
            return res.status(200).json({
              error: `The data is up to date`,
            });
          }
        }
      }
    } else {
      return res
        .status(404)
        .json({ error: "User intented to be updated with, not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const second_level_delete_entry_in_a_single_data_array = async (req, res) => {
  const { key, _key, _value, value, pok } = req.params;
  const { account_type } = req.headers;
  try {
    const db = await connectToDatabase();

    // Validate that and updatedData are provided
    if (!req.body.value_to_update || !_key || !_value) {
      return res.status(400).json({ error: "Missing fields required" });
    }

    // Create a dynamic query
    let query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }

    // First, we fetch the user in the folder
    const stakeholder_obj = await db
      .collection(
        account_type === "dashboard_account" ? "accounts" : "dashboards"
      )
      .findOne({ email: req.body.value_to_update?.email });

    if (stakeholder_obj) {
      if (
        stakeholder_obj?.access_key !== req.body.value_to_update?.access_key
      ) {
        res.status(400).json({ error: "Wrong Access key" });
      }
      if (
        stakeholder_obj?.access_key === req.body.value_to_update?.access_key
      ) {
        const updateResult = await db.collection("accounts").updateOne(
          { ...query, [`${pok}._id`]: new ObjectId(stakeholder_obj?._id) },
          {
            $pull: {
              [`${pok}.$`]: req.body.value_to_update,
            },
          }
        );

        if (updateResult.modifiedCount > 0) {
          return res.status(200).json({
            message: `Successfully deleted element with ${_key}:${_value} in ${pok}`,
          });
        } else {
          return res.status(200).json({
            error: `The data is up to date`,
          });
        }
      }
    } else {
      return res
        .status(404)
        .json({ error: "User intented to be deleted with, not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  second_level_add_to_set_single_data_arrays,
  second_level_add_to_set_multiple_data_arrays,
  second_level_update_entry_in_a_single_data_array,
  second_level_delete_entry_in_a_single_data_array,
  second_level_pull_multiple_data_arrays,
  second_level_pull_single_data_arrays,
};
