const express = require("express");
const { connectToDatabase } = require("../utils/db");

const {
  add_to_set_single_data_arrays,
  add_to_set_multiple_data_arrays,
  pull_multiple_data_arrays,
  pull_single_data_arrays,
  manage_stakeholders,
} = require("../controllers/dashboards/first-level/handling-arrays");

const {
  set_single_data_objects,
  set_multiple_data_objects,
  fetch_single_data_objects,
} = require("../controllers/dashboards/first-level/handling-objects");

const {
  set_single_data_strings,
  set_multiple_data_strings,
  fetch_single_data_strings,
} = require("../controllers/dashboards/first-level/handling-strings");

const {
  second_level_add_to_set_single_data_arrays,
  second_level_add_to_set_multiple_data_arrays,
  second_level_pull_multiple_data_arrays,
  second_level_pull_single_data_arrays,
  second_level_update_entry_in_a_single_data_array,
  second_level_delete_entry_in_a_single_data_array,
} = require("../controllers/dashboards/second-level/handling-arrays");

const {
  second_level_set_single_data_objects,
  second_level_set_multiple_data_objects,
  second_level_fetch_single_data_objects,
} = require("../controllers/dashboards/second-level/handling-objects");

const {
  second_level_set_single_data_strings,
  second_level_set_multiple_data_strings,
} = require("../controllers/dashboards/second-level/handling-strings");

const {
  third_level_add_to_set_single_data_arrays,
  third_level_add_to_set_multiple_data_arrays,
  third_level_pull_multiple_data_arrays,
  third_level_pull_single_data_arrays,
} = require("../controllers/dashboards/third-level/handling-arrays");

const {
  third_level_set_multiple_data_objects,
  third_level_set_single_data_objects,
} = require("../controllers/dashboards/third-level/handling-objects");

const {
  third_level_set_single_data_strings,
  third_level_set_multiple_data_strings,
} = require("../controllers/dashboards/third-level/handling-strings");

const {
  upsert_new_user,
  fetch_single_user,
  signin_user,
  update_single_user,
  search_,
  access_single_user,
  search_multiple_usersmultiple_users,
  search_multiple_users,
  fetch_single_user_req_made_by_dashboard,
  upsert_new_user_using_auth_provider,
  signin_user_using_auth_provider,
} = require("../controllers/dashboards");

const { authenticate } = require("../utils/creds-checking");
const authenticate_fetch_user_req = require("../utils/grant-fetch-user-with-accesskey-access");

const router = express.Router();

// Global authentication middleware (uncomment to apply globally)
// router.use(authenticate);

/* ---------------- NON-LEVEL ENDPOINTS ---------------- */

/* ---------- POST REQUESTS ---------- */

// Create or update a user
router.post("/upsert-new", upsert_new_user);
router.post(
  "/external-auth-provider/upsert-new",
  upsert_new_user_using_auth_provider
);

// User login
router.post("/signin-user", signin_user);
router.post(
  "/external-auth-provider/signin-user",
  signin_user_using_auth_provider
);

// Access user dashboard
router.post("/access-user", access_single_user);

/* ---------- GET REQUESTS ---------- */

// Fetch a single user by key-value pair
router.get("/fetch-single-data/:key/:value", authenticate, fetch_single_user);

// Search within a data array by specific key-value criteria
router.get(
  "/search-single-data-array-of-data/:key/:value/:_key/:_value",
  search_multiple_users
);

// Fetch a single user for dashboard access, with custom authentication
router.get(
  "/fetch-single-user/:key/:value",
  authenticate_fetch_user_req,
  fetch_single_user_req_made_by_dashboard
);

/* ---------- PUT REQUESTS ---------- */

// Update a single user data entry
router.put("/update-single-data/:key/:value", authenticate, update_single_user);

/* ---------------- FIRST LEVEL ENDPOINTS ---------------- */

/* ---------- PUT REQUESTS ---------- */

// Add an entry to an array in a single document
router.put(
  "/update-add-to-set-single-data-arrays/:key/:value",
  add_to_set_single_data_arrays
);

// Manage stakeholders array (add or remove) in a single document
router.put(
  "/update-add-to-set-or-pull-stakeholder-in-single-data-arrays/:key/:value/:action",
  manage_stakeholders
);

// Add an entry to an array in multiple documents
router.put(
  "/update-add-to-set-multiple-data-arrays/:key/:value",
  add_to_set_multiple_data_arrays
);

// Remove an entry from an array in multiple documents
router.put(
  "/update-pull-multiple-data-arrays/:key/:value",
  pull_multiple_data_arrays
);

// Remove an entry from an array in a single document
router.put(
  "/update-pull-single-data-arrays/:key/:value",
  pull_single_data_arrays
);

// Update an object entry in a single document
router.put(
  "/update-set-single-data-objects/:key/:value",
  set_single_data_objects
);

// Update an object entry in multiple documents
router.put(
  "/update-set-multiple-data-objects/:key/:value",
  set_multiple_data_objects
);

// Update a string entry in a single document
router.put(
  "/update-set-single-data-strings/:key/:value",
  set_single_data_strings
);

// Update a string entry in multiple documents
router.put(
  "/update-set-multiple-data-strings/:key/:value",
  set_multiple_data_strings
);

/* ---------- GET REQUESTS ---------- */

// Fetch a single object entry in a document by specific key
router.get(
  "/fetch-single-data-objects/:key/:value/:keyn_req",
  authenticate,
  fetch_single_data_objects
);

// Fetch a single string entry in a document by specific key
router.get(
  "/fetch-single-data-strings/:key/:value/:keyn_req",
  authenticate,
  fetch_single_data_strings
);

/* ---------------- SECOND LEVEL ENDPOINTS ---------------- */

/* ---------- PUT REQUESTS ---------- */

// Second-level update operations on array and object entries

// Add an entry to an array in a single document at a nested level
router.put(
  "/update-add-to-set-single-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_add_to_set_single_data_arrays
);

// Add an entry to an array in multiple documents at a nested level
router.put(
  "/update-add-to-set-multiple-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_add_to_set_multiple_data_arrays
);

// Remove an entry from an array in multiple documents at a nested level
router.put(
  "/update-pull-multiple-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_pull_multiple_data_arrays
);

// Remove an entry from an array in a single document at a nested level
router.put(
  "/update-pull-single-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_pull_single_data_arrays
);

// Update an object entry in a single document at a nested level
router.put(
  "/update-set-single-data-objects/:pok/:key/:value",
  authenticate,
  second_level_set_single_data_objects
);

// Update a specific array entry within an object in a single document
router.put(
  "/update-set-single-data-objects/:pok/:key/:value/:_key/:_value",
  authenticate,
  second_level_update_entry_in_a_single_data_array
);

/* ---------- DELETE REQUESTS ---------- */

// Delete a specific entry from an object in a document at a nested level
router.delete(
  "/update-set-single-data-objects/:pok/:key/:value/:_key/:_value",
  authenticate,
  second_level_delete_entry_in_a_single_data_array
);

/* ---------- GET REQUESTS ---------- */

// Fetch an object within a document at a nested level
router.get(
  "/fetch-single-data-objects/:pok/:key/:value/:keyn_req",
  authenticate,
  second_level_fetch_single_data_objects
);

/* ---------------- THIRD LEVEL ENDPOINTS ---------------- */

/* ---------- PUT REQUESTS ---------- */

// Third-level update operations for deeply nested entries

// Add an entry to an array in a single document at a third nested level
router.put(
  "/update-add-to-set-single-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_add_to_set_single_data_arrays
);

// Add an entry to an array in multiple documents at a third nested level
router.put(
  "/update-add-to-set-multiple-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_add_to_set_multiple_data_arrays
);

// Remove an entry from an array in multiple documents at a third nested level
router.put(
  "/update-pull-multiple-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_pull_multiple_data_arrays
);

// Remove an entry from an array in a single document at a third nested level
router.put(
  "/update-pull-single-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_pull_single_data_arrays
);

// Update an object entry in a single document at a third nested level
router.put(
  "/update-set-single-data-objects/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_single_data_objects
);

// Update an object entry in multiple documents at a third nested level
router.put(
  "/update-set-multiple-data-objects/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_multiple_data_objects
);

// Update a string entry in a single document at a third nested level
router.put(
  "/update-set-single-data-strings/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_single_data_strings
);

// Update a string entry in multiple documents at a third nested level
router.put(
  "/update-set-multiple-data-strings/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_multiple_data_strings
);

module.exports = router;
