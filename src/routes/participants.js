const express = require("express");
const { authenticate_participant } = require("../utils/creds-participants");
const {
  fetch_single_data_objects,
  fetch_multiple_data_objects_being_participated_in,
  set_single_data_objects,
  fetch_target_data_and_ommit_other_data,
} = require("../controllers/dashboards/first-level/handling-objects");
const {
  set_single_data_strings,
} = require("../controllers/dashboards/first-level/handling-strings");
const {
  second_level_update_entry_in_a_single_data_array,
} = require("../controllers/dashboards/second-level/handling-arrays");

const router = express.Router();

/* ---------- GET REQUESTS ---------- */

// Fetch target data while omitting specific keys
router.get(
  "/fetch-target-data-and-omit-other-data/:key/:value/:keys_to_omit",
  authenticate_participant,
  fetch_target_data_and_ommit_other_data
);

// Fetch a single data entry by key, returning specified string fields
router.get(
  "/fetch-single-data-strings/:key/:value/:keyn_req",
  authenticate_participant,
  fetch_single_data_objects
);

// Fetch a single data entry by key, returning specified object fields
router.get(
  "/fetch-single-data-objects/:key/:value/:keyn_req",
  authenticate_participant,
  fetch_single_data_objects
);

// Fetch multiple data entries where the participant is involved
router.get(
  "/fetch-multiple-data-objects/:key/:value",
  authenticate_participant,
  fetch_multiple_data_objects_being_participated_in
);

/* ---------- PUT REQUESTS ---------- */

// Update an object entry in a single document by participant
router.put(
  "/update-set-single-data-objects/:key/:value",
  authenticate_participant,
  set_single_data_objects
);

// Update a specific entry in an array of objects in a single document (second-level)
router.put(
  "/update-set-single-data-objects/:pok/:key/:value/:_key/:_value",
  authenticate_participant,
  second_level_update_entry_in_a_single_data_array
);

// Update a string entry in a single document by participant
router.put(
  "/update-set-single-data-strings/:key/:value",
  authenticate_participant,
  set_single_data_strings
);

module.exports = router;
