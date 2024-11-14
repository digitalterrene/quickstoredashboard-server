const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const corsOptions = {
  origin: [
    "https://account.quickstoredashboard.com",
    "https://quickstoredashboard.vercel.app",
    "http://localhost:3001",
    "http://localhost:3000",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "1000mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));

// Database connection logic
const uri = `${process.env.MONGO_URI}`;
const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to the database");

    // Start the server only if the database connection is successful
    const server = app.listen(`${process.env.PORT}`, () => {
      console.log("App is running on port", `${process.env.PORT}` || 5000);
    });

    // Set a timeout for the server
    server.timeout = 30000; // Set timeout to 30 seconds (adjust as needed)
  } catch (error) {
    console.error("Error connecting to the database:", error);
    // Handle the error as needed, e.g., exit the process or send an error response
  }
}

startServer();

// Routes
const accounts = require("./routes/accounts.js");
const dashboards = require("./routes/dashboards.js");
const participants = require("./routes/participants.js");
const stores = require("./routes/data-routes/stores.js");

app.use("/accounts", accounts);
app.use("/dashboards", dashboards);
app.use("/dashboards/participants", participants);
app.use("/dashboards/stores", stores);
