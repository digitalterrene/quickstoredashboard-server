const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const {
  validateEmail,
  encryptData,
  createToken,
  validatePassword,
} = require("../../utils/creds-checking");
const { connectToDatabase } = require("../../utils/db");

const upsert_new_user = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { email, password, access_key, security_key } = req.body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
      return res.status(400).json({ error: emailValidation.error });
    }
    // Check if email is already in use
    const existingUser = await db.collection("dashboards").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is taken!" });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (passwordValidation.error) {
      return res.status(400).json({ error: passwordValidation.error });
    }
    if (!access_key) {
      return res.status(400).json({ error: "Access key is required" });
    }
    if (!security_key) {
      return res.status(400).json({ error: "Security key is required" });
    }
    // Encrypt sensitive data
    const encryptedPassword = await encryptData("password", password);
    const encryptedSecurityKey = await encryptData(
      "security_key",
      security_key
    );

    // Insert the document with encrypted values
    const result = await db.collection("dashboards").insertOne({
      ...req.body,
      ...encryptedPassword,
      ...encryptedSecurityKey,
    });

    // Create a token using the document's _id
    const token = createToken(result.insertedId);

    // Update the document with the generated token
    await db
      .collection("dashboards")
      .updateOne({ _id: new ObjectId(result.insertedId) }, { $set: { token } });

    // Set a cookie with user information
    const insertedUser = await db
      .collection("dashboards")
      .findOne({ _id: new ObjectId(result.insertedId) });
    const { name, image, _id } = insertedUser;

    res.status(201).json({ name, email, image, _id, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const upsert_new_user_using_auth_provider = async (req, res) => {
  try {
    const db = await connectToDatabase();

    const { email, user_external_uid } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email  is required" });
    }
    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
      return res.status(400).json({ error: emailValidation.error });
    }
    // Check if email is already in use
    const existingUser = await db.collection("dashboards").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is taken!" });
    }
    if (!user_external_uid) {
      return res.status(400).json({ error: "User uid key is required" });
    }
    // Insert the document with encrypted values
    const result = await db.collection("dashboards").insertOne({
      ...req.body,
    });

    // Create a token using the document's _id
    const token = createToken(result.insertedId);

    // Update the document with the generated token
    await db
      .collection("dashboards")
      .updateOne({ _id: new ObjectId(result.insertedId) }, { $set: { token } });

    // Set a cookie with user information
    const insertedUser = await db
      .collection("dashboards")
      .findOne({ _id: new ObjectId(result.insertedId) });
    const {
      name: savedName,
      auth_provider,
      user_external_uid: userExternalUid,
      image: savedImage,
      _id,
    } = insertedUser;

    res.status(201).json({
      name: savedName,
      email,
      auth_provider,
      image: savedImage,
      user_external_uid: userExternalUid,
      _id,
      token,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};
const fetch_single_user = async (req, res) => {
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
    const dashboard = await db.collection("dashboards").findOne(query);
    if (dashboard) {
      res.status(200).json(dashboard);
    } else {
      res
        .status(404)
        .json({ error: `Failed to fetch data with ${key}:${value}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const fetch_single_user_req_made_by_dashboard = async (req, res) => {
  const { key, value } = req.params;
  const { access_key } = req.headers;
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
    if (!access_key) {
      return res.status(400).json({ error: "Access key is required" });
    }
    const dashboard = await db.collection("dashboards").findOne(query);
    if (dashboard) {
      if (dashboard?.access_key === access_key) {
        const { email, access_key } = dashboard;
        res.status(200).json({ email, access_key });
      } else {
        res.status(400).json({ error: "Wrong access key" });
      }
    } else {
      res
        .status(404)
        .json({ error: `Failed to fetch data with ${key}:${value}` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const search_multiple_users = async (req, res) => {
  const { key, value, _key, _value } = req.params;
  try {
    const db = await connectToDatabase();
    let query;
    let _query;

    if (key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      query = { [key]: new ObjectId(value) };
    } else {
      // For other fields like "title," use as is
      query = { [key]: value };
    }
    if (_key === "_id") {
      // Convert the provided value to ObjectId for querying by _id
      _query = { [_key]: new ObjectId(_value) };
    } else {
      // For other fields like "title," use as is
      _query = { [_key]: _value };
    }
    const dashboardsCursor = await db
      .collection("dashboards")
      .find({ ...query, ..._query });

    const dashboards = await dashboardsCursor.toArray();

    if (dashboards.length > 0) {
      res.status(200).json(dashboards);
    } else {
      res.status(404).json({
        error: `Failed to fetch data with ${key}:${value} and also ${_key}:${_value}`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update_single_user = async (req, res) => {
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

    // Check if the keys requiring encryption are present
    const keysToEncrypt = ["password", "security_key"];
    const keysPresent = keysToEncrypt.filter((key) => req.body[key]);

    // If keys are present, perform validation and encryption
    if (keysPresent.length > 0) {
      // Validate password, if present
      if (keysPresent.includes("password")) {
        const passwordValidation = validatePassword(req.body.password);
        if (passwordValidation.error) {
          return res.status(400).json({ error: passwordValidation.error });
        }
      }

      // Encrypt sensitive data
      for (const key of keysPresent) {
        try {
          const encryptedData = await encryptData(key, req.body[key]);
          if (encryptedData.error) {
            return res.status(500).json({ error: encryptedData.error });
          }
          req.body[key] = encryptedData[key];
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }
    }

    // Update the document
    const dashboard = await db
      .collection("dashboards")
      .findOneAndUpdate(query, { $set: req.body });

    if (dashboard) {
      return res.status(200).json({ message: "User updated successfully" });
    } else {
      return res
        .status(404)
        .json({ error: `Failed to fetch data with ${key}:${value}` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const signin_user = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { email, password } = req.body;

    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
      return res.status(400).json({ error: emailValidation.error });
    }

    // Check if email is already in use
    const existingUser = await db.collection("dashboards").findOne({ email });
    if (existingUser) {
      // Validate password
      const passwordValidation = validatePassword(password);
      if (passwordValidation.error) {
        return res.status(400).json({ error: passwordValidation.error });
      }
      //comparing if the password provided matches that of the dashboard
      const validity = await bcrypt.compare(password, existingUser.password);
      if (!validity) {
        res.status(400).json({ error: "Wrong password" });
      }
      if (validity) {
        const { name, image, _id, email } = existingUser;

        const token = createToken(_id);

        // Update the document with the generated token
        await db
          .collection("dashboards")
          .updateOne({ _id: new ObjectId(_id) }, { $set: { token } });

        // Set the token in the response
        res.cookie("authToken", token, { maxAge: 86400000, httpOnly: true });
        return res.status(200).json({ name, image, _id, token, email });
      }
    } else {
      return res.status(404).json({ error: "Email does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const access_single_user = async (req, res) => {
  try {
    const { email, access_key } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!access_key) {
      return res.status(400).json({ error: "Access key is required" });
    }

    const db = await connectToDatabase();
    const dashboard = await db.collection("dashboards").findOne({ email });

    if (dashboard) {
      if (dashboard.access_key !== access_key) {
        return res.status(400).json({ error: "Wrong access key" });
      }

      const { _id, name, extension, username, image } = dashboard;
      return res
        .status(200)
        .json({ _id, name, extension, email, username, image });
    } else {
      return res.status(404).json({ error: "Failed to fetch dashboard" });
    }
  } catch (error) {
    console.error("Error in accessSingleUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const signin_user_using_auth_provider = async (req, res) => {
  try {
    //any keypair they send is whta we use

    const { user_external_uid } = req.body;

    // Input validation
    if (!user_external_uid) {
      return res
        .status(400)
        .json({ error: "Auth provider's keypair is required" });
    }
    const db = await connectToDatabase();
    const dashboard = await db
      .collection("dashboards")
      .findOne({ user_external_uid });

    if (dashboard) {
      const { name, image, _id, email } = dashboard;

      const token = createToken(_id);

      // Update the document with the generated token
      await db
        .collection("dashboards")
        .updateOne({ _id: new ObjectId(_id) }, { $set: { token } });

      // Set the token in the response
      res.cookie("authToken", token, { maxAge: 86400000, httpOnly: true });
      return res.status(200).json({ name, image, _id, token, email });
    } else {
      return res.status(404).json({ error: "Failed to fetch dashboard" });
    }
  } catch (error) {
    console.error("Error in accessSingleUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  upsert_new_user,
  signin_user,
  signin_user,
  upsert_new_user_using_auth_provider,
  signin_user_using_auth_provider,
  update_single_user,
  search_multiple_users,
  access_single_user,
  fetch_single_user,
  fetch_single_user_req_made_by_dashboard,
};
