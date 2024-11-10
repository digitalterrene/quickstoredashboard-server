const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../../utils/db");

// processing creds
require("dotenv").config();

const stores_second_level_fetch_single_data_in_an_array = async (req, res) => {
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

    // Construct dynamic aggregation pipeline
    const aggregationPipeline = [
      { $match: query }, // Match the main document by key-value pairs
      {
        $project: {
          [pok]: {
            $filter: {
              input: `$${pok}`, // Access the nested array dynamically
              as: "element",
              cond: { $eq: ["$$element._id", target_element_id] }, // Filter based on the provided _id
            },
          },
        },
      },
    ];

    const dashboard = await db
      .collection("dashboards")
      .aggregate(aggregationPipeline)
      .toArray();

    // Validate if the dashboard and product exist
    if (dashboard && dashboard.length > 0 && dashboard[0][pok].length > 0) {
      const product = dashboard[0][pok][0]; // Extract the matched product
      return res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Dashboard or target element not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const stores_second_level_fetch_multiple_data_in_an_array = async (
  req,
  res
) => {
  const { key, value, target_element_key, target_element_id, pok } = req.params;

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

    // Construct dynamic aggregation pipeline
    const aggregationPipeline = [
      { $match: query }, // Match the main document by key-value pairs
      {
        $project: {
          [pok]: {
            $filter: {
              input: `$${pok}`, // Access the nested array dynamically
              as: "element",
              cond: {
                $eq: [`$$element.${target_element_key}`, target_element_id],
              }, // Filter based on the provided _id
            },
          },
        },
      },
    ];

    const dashboard = await db
      .collection("dashboards")
      .aggregate(aggregationPipeline)
      .toArray();

    // Validate if the dashboard and element exist
    if (dashboard && dashboard.length > 0 && dashboard[0][pok].length > 0) {
      const element = dashboard[0][pok]; // Extract the matched element
      return res.status(200).json(element);
    } else {
      res.status(404).json({ error: "Dashboard or target element not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  stores_second_level_fetch_single_data_in_an_array,
  stores_second_level_fetch_multiple_data_in_an_array,
};
