const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("../../../../../utils/db");
const { v4: uuidv4 } = require("uuid");

const product_suppliers_manage_data = async (req, res) => {
  const { action, key, value } = req.params;
  const { element_id } = req.headers;
  const data_type = req.body?.value_to_update?.data_type;

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
        const itemsToAdd = req.body.items_to_add || [];
        const updateOps = itemsToAdd.map((item) => ({
          updateMany: {
            filter: query,
            update: {
              $addToSet: {
                [`${req.body.key_to_update}`]: {
                  ...item,
                  external_supplier: true,
                  _id: uuidv4(),
                },
              },
            },
            // Add options here if needed
          },
        }));

        // Apply each update operation separately
        for (const op of updateOps) {
          const result = await db
            .collection("dashboards")
            .updateMany(op.updateMany.filter, op.updateMany.update);
          if (result.modifiedCount === 0) {
            return res.status(400).json({
              error: `Failed to add some items to ${req.body.value_to_update?.data_type}`,
            });
          }
        }

        return res.status(200).json({
          message: `Successfully added items to ${req.body.value_to_update?.data_type}`,
        });
      } catch (error) {
        console.error("Error occurred during add_to_set operation:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else if (action === "update") {
      try {
        const { key_to_update, items_to_update } = req.body;

        for (const item of items_to_update) {
          const { _id, ...updateFields } = item;
          const result = await db.collection("dashboards").updateMany(
            {
              ...query,
              [`${key_to_update}._id`]: _id,
            },
            {
              $set: updateFields,
            }
          );
          if (result.modifiedCount === 0) {
            return res.status(400).json({
              error: "Failed to update some items",
            });
          }
        }

        return res.status(200).json({
          message: "All items updated successfully",
        });
      } catch (error) {
        console.error("Error occurred during update operation:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else if (action === "pull") {
      try {
        const itemsToRemove = req.body.items_to_remove || [];

        for (const itemId of itemsToRemove) {
          const result = await db.collection("dashboards").updateMany(query, {
            $pull: {
              [`${req.body.key_to_update}`]: {
                _id: itemId,
              },
            },
          });
          if (result.modifiedCount === 0) {
            return res.status(400).json({
              error: `Failed to remove some items from ${req.body.value_to_update?.data_type}`,
            });
          }
        }

        return res.status(200).json({
          message: `Successfully removed items from ${req.body.value_to_update?.data_type}`,
        });
      } catch (error) {
        console.error("Error occurred during pull operation:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(400).json({
        error: `Action invalid. Try add_to_set, update, or pull`,
      });
    }
  } catch (error) {
    console.error("Error occurred during database operation:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  product_suppliers_manage_data,
};
