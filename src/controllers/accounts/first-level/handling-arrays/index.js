const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../utils/db");
const bcrypt = require("bcryptjs");
// processing creds
require("dotenv").config();

const add_to_set_single_data_arrays = async (req, res) => {
  const { key, value } = req.params;
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
        [`${req.body.key_to_update}`]: req.body.value_to_update,
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
const manage_stakeholders = async (req, res) => {
  const { action, key, value } = req.params;
  const { account_type } = req.headers;
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
          error: "User intented to be updated with, not found. Server's error",
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
      if (stakeholder_obj.access_key !== req.body.value_to_update?.access_key) {
        res.status(400).json({ error: "Wrong Access key" });
      }
      if (stakeholder_obj.access_key === req.body.value_to_update?.access_key) {
        // if (action === "add_to_set") {
        //   const accounts = await db.collection("accounts").updateOne(query, {
        //     $addToSet: {
        //       [`${req.body.key_to_update}`]: {
        //         ...req.body.value_to_update,
        //         email: stakeholder_obj?.email,
        //         status: stakeholder_obj?.status,
        //         image: stakeholder_obj?.image,
        //         name: stakeholder_obj?.name,
        //         access_key: stakeholder_obj?.access_key,
        //         _id: new ObjectId(stakeholder_obj?._id),
        //       },
        //     },
        //   });
        //   //Validate the required fields before creating the dashboard
        //   if (accounts) {
        //     return res.status(200).json({
        //       message: `Successfully added to ${req.body.value_to_update?.stakeholder_type}`,
        //     });
        //   }
        // }
        if (action === "add_to_set") {
          const existingStakeholders = await db
            .collection("accounts")
            .findOne(query);

          // Ensure the key exists and initialize it if necessary
          if (!existingStakeholders[req.body.key_to_update]) {
            existingStakeholders[req.body.key_to_update] = [];
          }

          // Check if the _id of the new stakeholder already exists in the array
          const existingStakeholder = existingStakeholders[
            req.body.key_to_update
          ].find((stakeholder) => {
            if (
              stakeholder._id instanceof ObjectId &&
              stakeholder_obj._id instanceof ObjectId
            ) {
              return stakeholder._id.equals(stakeholder_obj._id);
            } else {
              return String(stakeholder._id) === String(stakeholder_obj._id);
            }
          });

          if (existingStakeholder) {
            return res
              .status(400)
              .json({ error: "Stakeholder already exists." });
          }

          const updateResult = await db
            .collection("accounts")
            .updateOne(query, {
              $addToSet: {
                [`${req.body.key_to_update}`]: {
                  ...req.body.value_to_update,
                  email: stakeholder_obj?.email,
                  status: stakeholder_obj?.status,
                  image: stakeholder_obj?.image,
                  name: stakeholder_obj?.name,
                  access_key: stakeholder_obj?.access_key,
                  _id: new ObjectId(stakeholder_obj._id),
                },
              },
            });

          if (updateResult.modifiedCount > 0) {
            return res.status(200).json({
              message: `Successfully added to ${req.body.value_to_update?.stakeholder_type}`,
            });
          } else {
            return res
              .status(400)
              .json({ error: "Failed to add stakeholder." });
          }
        }

        if (action === "pull") {
          const accounts = await db.collection("accounts").updateOne(query, {
            $pull: {
              [`${req.body.key_to_update}`]: {
                _id: stakeholder_obj?._id,
              },
            },
          });
          //Validate the required fields before creating the dashboard
          if (accounts) {
            return res.status(200).json({
              message: `Successfully removed from ${req.body.value_to_update?.stakeholder_type}`,
            });
          }
        } else {
          res.status(400).json({
            error: `Action invalid. Try add_to_set or pull`,
          });
        }
      }
    } else {
      res.status(404).json({
        error: `User with email ${req.body.value_to_update?.email} was not found`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const add_to_set_multiple_data_arrays = async (req, res) => {
  const { key, value } = req.params;
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
        [`${req.body.key_to_update}`]: req.body.value_to_update,
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
const pull_multiple_data_arrays = async (req, res) => {
  const { key, value } = req.params;
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
        [`${req.body.key_to_update}`]: req.body.value_to_update,
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
const pull_single_data_arrays = async (req, res) => {
  const { key, value } = req.params;
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
        [`${req.body.key_to_update}`]: req.body.value_to_update,
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
module.exports = {
  add_to_set_single_data_arrays,
  add_to_set_multiple_data_arrays,
  pull_multiple_data_arrays,
  manage_stakeholders,
  pull_single_data_arrays,
};
