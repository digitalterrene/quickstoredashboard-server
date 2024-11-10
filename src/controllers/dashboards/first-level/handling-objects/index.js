const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../utils/db");

// processing creds
require("dotenv").config();

const set_single_data_objects = async (req, res) => {
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
    const dashboards = await db.collection("dashboards").updateOne(query, {
      $set: {
        [`${req.body.key_to_update}`]: req.body.value_to_update,
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
const set_multiple_data_objects = async (req, res) => {
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
    const dashboards = await db.collection("dashboards").updateMany(query, {
      $set: {
        [`${req.body.key_to_update}`]: req.body.value_to_update,
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
const fetch_single_data_objects = async (req, res) => {
  const { key, value, keyn_req } = req.params;
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
    if (account && account[keyn_req]) {
      return res.status(200).json(account[keyn_req]);
    } else {
      res.status(404).json({ error: `Data not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const fetch_target_data_and_ommit_other_data = async (req, res) => {
  const { key, value, keys_to_omit } = req.params;
  // key is the field to search for, value is its value, keys_to_omit is a string containing keys to omit separated by '-'

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

    // Fetch the account data
    const account = await db.collection("dashboards").findOne(query);

    if (account) {
      // Create a new object with the required data and omitting specified keys
      const dataToSend = { ...account };
      keys_to_omit.split("-").forEach((keyToOmit) => {
        delete dataToSend[keyToOmit];
      });

      return res.status(200).json(dataToSend);
    } else {
      res.status(404).json({ error: `Data not found` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetch_multiple_data_objects_being_participated_in = async (req, res) => {
  const participation_list = [
    "management",
    "employees",
    "participants",
    "participations",
    "legal_stakeholders",
  ];
  //
  const { key, value } = req.params;
  const { participant_id } = req.headers;

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
    if (!participant_id) {
      res.status(400).json({ error: "Participant ID is required" });
    }
    // Fetch dashboards of type keyn_req that have the participant_id as the user_id
    const dashboards_matching_with_user_id = await db
      .collection("dashboards")
      .find({ user_id: participant_id, ...query })
      .project({
        name: 1,
        username: 1,
        extention: 1,
        tagline: 1,
        image: 1,
        _id: 1,
        access_key: 1,
        email: 1,
      })
      .toArray();

    // Fetch additional data for each participation list based on the dashboard_type
    const dashboards_matching_with_participation = await Promise.all(
      participation_list.map(async (listKey) => {
        const additionalData = await db
          .collection("dashboards")
          .find({
            ...query,
            [listKey]: { $elemMatch: { _id: new ObjectId(participant_id) } },
          })
          .toArray();
        if (additionalData.length > 0) {
          const {
            name,
            username,
            extention,
            tagline,
            image,
            _id,
            access_key,
            email,
          } = additionalData[0];
          return {
            name,
            username,
            tagline,
            extention,
            image,
            _id,
            access_key,
            email,
          };
        }
        return null; // Return null for non-matching data
      })
    );

    // Filter out null entries and combine dashboards_matching_with_user_id
    const final_array = [
      ...dashboards_matching_with_user_id,
      ...dashboards_matching_with_participation.filter((data) => data !== null),
    ];

    return res.status(200).json(final_array);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  set_single_data_objects,
  set_multiple_data_objects,
  fetch_single_data_objects,
  fetch_multiple_data_objects_being_participated_in,
  fetch_target_data_and_ommit_other_data,
};
