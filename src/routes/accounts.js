const express = require("express");

const {
  add_to_set_single_data_arrays,
  add_to_set_multiple_data_arrays,
  pull_multiple_data_arrays,
  pull_single_data_arrays,
  manage_stakeholders,
} = require("../controllers/accounts/first-level/handling-arrays");

const {
  set_single_data_objects,
  set_multiple_data_objects,
  fetch_single_data_objects,
} = require("../controllers/accounts/first-level/handling-objects");

const {
  set_single_data_strings,
  set_multiple_data_strings,
  fetch_single_data_strings,
} = require("../controllers/accounts/first-level/handling-strings");

const {
  second_level_add_to_set_single_data_arrays,
  second_level_add_to_set_multiple_data_arrays,
  second_level_pull_multiple_data_arrays,
  second_level_pull_single_data_arrays,
  second_level_update_entry_in_a_single_data_array,
  second_level_delete_entry_in_a_single_data_array,
} = require("../controllers/accounts/second-level/handling-arrays");

const {
  second_level_set_single_data_objects,
  second_level_set_multiple_data_objects,
  second_level_fetch_single_data_objects,
  stores_second_level_pull_single_data_from_an_array,
} = require("../controllers/accounts/second-level/handling-objects");

const {
  second_level_set_single_data_strings,
  second_level_set_multiple_data_strings,
} = require("../controllers/accounts/second-level/handling-strings");

const {
  third_level_add_to_set_single_data_arrays,
  third_level_add_to_set_multiple_data_arrays,
  third_level_pull_multiple_data_arrays,
  third_level_pull_single_data_arrays,
} = require("../controllers/accounts/third-level/handling-arrays");

const {
  third_level_set_multiple_data_objects,
  third_level_set_single_data_objects,
} = require("../controllers/accounts/third-level/handling-objects");

const {
  third_level_set_single_data_strings,
  third_level_set_multiple_data_strings,
} = require("../controllers/accounts/third-level/handling-strings");
const { authenticate } = require("../utils/creds-checking");
const {
  upsert_new_user,
  signin_user,
  update_single_user,
  fetch_single_user_req_made_by_dashboard,
} = require("../controllers/accounts");
const authenticate_fetch_user_req = require("../utils/grant-fetch-user-with-accesskey-access");
const {
  manage_data,
  fetch_all_data,
} = require("../controllers/accounts/first-level/handling-arrays/index2");

const router = express.Router();

// Global Authentication Middleware
// router.use(authenticate);

/* ---------------------------- NON-LEVEL ENDPOINTS ---------------------------- */

/* ---------------------------- POST REQUESTS ---------------------------- */

// Create or update a new user
router.post("/upsert-new", upsert_new_user);

// Add new data, similar to adding data in store dashboards
router.post("/add-new-data/:key/:value/:action", manage_data);

// Log in user
router.post("/signin-user", signin_user);

/* ---------------------------- GET REQUESTS ---------------------------- */

// Fetch a single user
router.get(
  "/fetch-single-user/:key/:value",
  authenticate_fetch_user_req,
  fetch_single_user_req_made_by_dashboard
);

// Fetch multiple data objects associated with an account
router.get(
  "/fetch-multiple-data-objects/:key/:value/:keyn_req",
  fetch_all_data
);

/* ---------------------------- PUT REQUESTS ---------------------------- */

// Update a single data record
router.put("/update-single-data/:key/:value", authenticate, update_single_user);

/* ---------------------------- FIRST LEVEL ENDPOINTS ---------------------------- */

/* ---------------------------- PUT REQUESTS ---------------------------- */

// Add an entry to an array within a single document
router.put(
  "/update-add-to-set-single-data-arrays/:key/:value",
  authenticate,
  add_to_set_single_data_arrays
);

// Manage stakeholder array in a single document
router.put(
  "/update-add-to-set-or-pull-stakeholder-in-single-data-arrays/:key/:value/:action",
  authenticate,
  manage_stakeholders
);

// Add entries to arrays across multiple documents
router.put(
  "/update-add-to-set-multiple-data-arrays/:key/:value",
  authenticate,
  add_to_set_multiple_data_arrays
);

// Remove entries from arrays in multiple documents
router.put(
  "/update-pull-multiple-data-arrays/:key/:value",
  authenticate,
  pull_multiple_data_arrays
);

// Remove an entry from an array within a single document
router.put(
  "/update-pull-single-data-arrays/:key/:value",
  authenticate,
  pull_single_data_arrays
);

// Update an object entry within a single document
router.put(
  "/update-set-single-data-objects/:key/:value",
  authenticate,
  set_single_data_objects
);

// Update object entries across multiple documents
router.put(
  "/update-set-multiple-data-objects/:key/:value",
  authenticate,
  set_multiple_data_objects
);

// Update a string entry within a single document
router.put(
  "/update-set-single-data-strings/:key/:value",
  authenticate,
  set_single_data_strings
);

// Update string entries across multiple documents
router.put(
  "/update-set-multple-data-strings/:key/:value",
  authenticate,
  set_multiple_data_strings
);

/* ---------------------------- GET REQUESTS ---------------------------- */

// Fetch an object from a single document
router.get(
  "/fetch-single-data-objects/:key/:value/:keyn_req",
  authenticate,
  fetch_single_data_objects
);

// Fetch a string from a single document
router.get(
  "/fetch-single-data-strings/:key/:value/:keyn_req",
  authenticate,
  fetch_single_data_strings
);

/* ---------------------------- SECOND LEVEL ENDPOINTS ---------------------------- */

/* ---------------------------- PUT REQUESTS ---------------------------- */

// Add an entry to an array within a single document (second level)
router.put(
  "/update-add-to-set-single-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_add_to_set_single_data_arrays
);

// Add entries to arrays across multiple documents (second level)
router.put(
  "/update-add-to-set-multiple-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_add_to_set_multiple_data_arrays
);

// Remove entries from arrays in multiple documents (second level)
router.put(
  "/update-pull-multiple-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_pull_multiple_data_arrays
);

// Remove an entry from an array within a single document (second level)
router.put(
  "/update-pull-single-data-arrays/:pok/:key/:value",
  authenticate,
  second_level_pull_single_data_arrays
);

// Update an object entry within a single document (second level)
router.put(
  "/update-set-single-data-objects/:pok/:key/:value",
  authenticate,
  second_level_set_single_data_objects
);

// Update object entries across multiple documents (second level)
router.put(
  "/update-set-multple-data-objects/:pok/:key/:value",
  authenticate,
  second_level_set_multiple_data_objects
);

// Update a string entry within a single document (second level)
router.put(
  "/update-set-single-data-strings/:pok/:key/:value",
  authenticate,
  second_level_set_single_data_strings
);

// Update string entries across multiple documents (second level)
router.put(
  "/update-set-multple-data-strings/:pok/:key/:value",
  authenticate,
  second_level_set_multiple_data_strings
);

// Update a specific entry within a single document's array (second level)
router.put(
  "/update-set-single-data-objects/:pok/:key/:value/:_key/:_value",
  authenticate,
  second_level_update_entry_in_a_single_data_array
);

/* ---------------------------- DELETE REQUESTS ---------------------------- */

// Delete a specific entry from a single document's array (second level)
router.delete(
  "/update-set-single-data-objects/:pok/:key/:value/:_key/:_value",
  authenticate,
  second_level_delete_entry_in_a_single_data_array
);

// Remove a single data entry from an array (second level)
router.delete(
  "/second-level-pull-single-data-from-array/:pok/:key/:value/:target_element_id",
  stores_second_level_pull_single_data_from_an_array
);

/* ---------------------------- GET REQUESTS ---------------------------- */

// Fetch a specific object from a document (second level)
router.get(
  "/fetch-single-data-objects/:pok/:key/:value/:keyn_req",
  authenticate,
  second_level_fetch_single_data_objects
);

/* ---------------------------- THIRD LEVEL ENDPOINTS ---------------------------- */

// Add an entry to an array within a single document (third level)
router.put(
  "/update-add-to-set-single-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_add_to_set_single_data_arrays
);

// Add entries to arrays across multiple documents (third level)
router.put(
  "/update-add-to-set-multiple-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_add_to_set_multiple_data_arrays
);

// Remove entries from arrays in multiple documents (third level)
router.put(
  "/update-pull-multiple-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_pull_multiple_data_arrays
);

// Remove an entry from an array within a single document (third level)
router.put(
  "/update-pull-single-data-arrays/:pok/:_pok/:key/:value",
  authenticate,
  third_level_pull_single_data_arrays
);

// Update an object entry within a single document (third level)
router.put(
  "/update-set-single-data-objects/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_single_data_objects
);

// Update object entries across multiple documents (third level)
router.put(
  "/update-set-multple-data-objects/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_multiple_data_objects
);

// Update a string entry within a single document (third level)
router.put(
  "/update-set-single-data-strings/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_single_data_strings
);

// Update string entries across multiple documents (third level)
router.put(
  "/update-set-multple-data-strings/:pok/:_pok/:key/:value",
  authenticate,
  third_level_set_multiple_data_strings
);

module.exports = router;
