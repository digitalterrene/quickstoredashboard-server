const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../../utils/db");
const { v4: uuidv4 } = require("uuid");

const manage_data = async (req, res) => {
  const { action, key, value } = req.params;
  const { element_id } = req.headers;

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

    if (action === "add_to_set") {
      try {
        const newly_set_element = await db
          .collection("dashboards")
          .updateOne(query, {
            $addToSet: {
              [`${req.body.key_to_update}`]: {
                ...req.body.value_to_update,
                _id: uuidv4(),
              },
            },
          });

        if (newly_set_element && newly_set_element.modifiedCount > 0) {
          return res.status(200).json({
            message: `Successfully added to ${req.body.value_to_update?.data_type}`,
          });
        } else {
          console.log("Failed to add element to set");
          return res.status(400).json({
            error: `Failed to add to ${req.body.value_to_update?.data_type}`,
          });
        }
      } catch (error) {
        console.error("Error occurred during add_to_set operation:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else if (action === "update") {
      try {
        const { key_to_update, value_to_update } = req.body;

        // Exclude data_type from value_to_update
        const { data_type, ...otherData } = value_to_update;
        const object_to_update = otherData;

        const updatePromises = Object.entries(object_to_update).map(
          async ([key, value]) => {
            try {
              const newly_updated_element = await db
                .collection("dashboards")
                .updateOne(
                  {
                    ...query,
                    [`${key_to_update}._id`]: element_id,
                  },
                  {
                    $set: {
                      [`${key_to_update}.$.${key}`]: value,
                    },
                  }
                );

              if (newly_updated_element && newly_updated_element.acknowledged) {
                return {
                  success: true,
                  message: `Successfully updated ${key}`,
                };
              } else {
                console.log(`Failed to update ${key}`);
                return { success: false, error: `Failed to update ${key}` };
              }
            } catch (error) {
              console.error("Error occurred during update operation:", error);
              return {
                success: false,
                error: `Error updating ${key}: ${error.message}`,
              };
            }
          }
        );

        const results = await Promise.all(updatePromises);
        // Check if any update failed
        const failedUpdates = results.filter((result) => !result.success);
        if (failedUpdates.length > 0) {
          return res
            .status(400)
            .json({ errors: failedUpdates.map((update) => update.error) });
        } else {
          return res
            .status(200)
            .json({ message: "All fields updated successfully" });
        }
      } catch (error) {
        console.error("Error occurred during update operation:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else if (action === "pull") {
      const newly_removed_element = await db
        .collection("dashboards")
        .updateOne(query, {
          $pull: {
            [`${req.body.key_to_update}`]: {
              _id: element_id,
            },
          },
        });

      if (newly_removed_element && newly_removed_element.modifiedCount > 0) {
        return res.status(200).json({
          message: `Successfully removed from ${req.body.value_to_update?.data_type}`,
        });
      } else {
        console.log("Failed to remove element");
        return res.status(400).json({
          error: `Failed to remove from ${req.body.value_to_update?.data_type}`,
        });
      }
    } else {
      res.status(400).json({
        error: `Action invalid. Try add_to_set or pull`,
      });
    }
  } catch (error) {
    console.error("Error occurred during database operation:", error);
    res.status(500).json({ error: error.message });
  }
};
const fetch_all_data = async (req, res) => {
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

const search_data_in_all_docs = async (req, res) => {
  const { search_key, search_value, keyn_req } = req.params;
  const { page, limit } = req.query; // Default page 1 and limit 10 if not provided

  // Parse the page and limit to ensure they are integers
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  try {
    const db = await connectToDatabase();

    // Fetch all documents from the dashboards collection
    const documents = await db.collection("dashboards").find({}).toArray();

    let results = [];

    documents.forEach((doc) => {
      if (doc[keyn_req] && Array.isArray(doc[keyn_req])) {
        // Filter the elements within the specified array
        const filteredElements = doc[keyn_req].filter(
          (element) => element[search_key] === search_value
        );
        results = results.concat(filteredElements);
      }
    });

    // Apply pagination to the filtered results
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIndex, startIndex + limitNum);

    if (paginatedResults.length > 0) {
      return res.status(200).json({
        totalResults,
        currentPage: pageNum,
        totalPages,
        results: paginatedResults,
      });
    } else {
      return res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const search_data_in_all_docs_with_comparison = async (req, res) => {
  const { search_key, comparison_operator, search_value, keyn_req } =
    req.params;
  const { page, limit } = req.query; // Default page 1 and limit 10 if not provided

  // Parse the page, limit, and search_value to ensure they are integers
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const searchValueNum = parseFloat(search_value); // Assuming search_value is a number

  try {
    const db = await connectToDatabase();

    // Fetch all documents from the dashboards collection
    const documents = await db.collection("dashboards").find({}).toArray();

    let results = [];

    documents.forEach((doc) => {
      if (doc[keyn_req] && Array.isArray(doc[keyn_req])) {
        // Filter the elements within the specified array based on the comparison operator
        const filteredElements = doc[keyn_req].filter((element) => {
          const elementValue = parseFloat(element[search_key]);
          switch (comparison_operator) {
            case "gt":
              return elementValue > searchValueNum;
            case "lt":
              return elementValue < searchValueNum;
            case "gte":
              return elementValue >= searchValueNum;
            case "lte":
              return elementValue <= searchValueNum;
            case "eq":
              return elementValue === searchValueNum;
            default:
              return false;
          }
        });
        results = results.concat(filteredElements);
      }
    });

    // Apply pagination to the filtered results
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIndex, startIndex + limitNum);

    if (paginatedResults.length > 0) {
      return res.status(200).json({
        totalResults,
        currentPage: pageNum,
        totalPages,
        results: paginatedResults,
      });
    } else {
      return res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  manage_data,
  fetch_all_data,
  search_data_in_all_docs,
  search_data_in_all_docs_with_comparison,
};
