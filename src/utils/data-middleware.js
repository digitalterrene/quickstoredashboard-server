const { ObjectId } = require("mongodb");
const { connectToDatabase } = require("./db");

const stores_data_middleware = async (req, res, next) => {
  const { key, value } = req.params;
  const { verifying_id } = req.headers;
  const data_type = req.body?.value_to_update?.data_type;

  if (!data_type || !verifying_id) {
    res
      .status(400)
      .json({ error: "Please provide data type and verifying ID" });
    return; // Add return statement to exit the middleware function
  }

  if (data_type) {
    let verifying_category = "";

    if (
      data_type === "products" ||
      data_type === "sales" ||
      data_type === "invoices" ||
      data_type === "expenses" ||
      data_type === "refunds"
    ) {
      switch (data_type) {
        case "products":
          verifying_category = "inventory";
          break;

        case "sales":
          verifying_category = "orders";
          break;

        case "invoices":
          verifying_category = "sales";
          break;

        case "expenses":
          verifying_category = "transactions";
          break;

        case "refunds":
          verifying_category = "sales";
          break;

        default:
          verifying_category = data_type;
          break;
      }
      const db = await connectToDatabase();
      const query =
        key === "_id" ? { [key]: new ObjectId(value) } : { [key]: value };
      const verifying_object_exists = await db
        .collection("dashboards")
        .findOne({
          ...query,
          [`${verifying_category}`]: {
            $elemMatch: { _id: verifying_id },
          },
        });
      if (verifying_object_exists) {
        req.headers["approved_data_type"] = verifying_category;

        next();
      } else {
        res.status(400).json({
          error: `${data_type} can only be added if it exists in ${verifying_category}`,
        });
      }
    } else {
      req.headers["approved_data_type"] = data_type;
      next();
    }
  }
};

module.exports = { stores_data_middleware };
