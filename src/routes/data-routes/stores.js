const express = require("express");
const {
  manage_data,
  fetch_all_data,
  search_data_in_all_docs,
  search_data_in_all_docs_with_comparison,
} = require("../../controllers/dashboards/first-level/handling-arrays/stores");
const {
  stores_second_level_update_data_in_an_array,
  stores_second_level_pull_single_data_from_an_array,
  stores_second_level_pull_multiple_data_from_an_array,
  stores_second_level_set_units_sold_data_object,
} = require("../../controllers/dashboards/second-level/handling-objects/stores");
const {
  stores_second_level_fetch_single_data_in_an_array,
  stores_second_level_fetch_multiple_data_in_an_array,
} = require("../../controllers/dashboards/second-level/handling-arrays/stores");
const {
  product_suppliers_manage_data,
} = require("../../controllers/dashboards/first-level/handling-arrays/products-suppliers");

const router = express.Router();

// Define endpoints for managing data with various HTTP methods

/* ----------------- NON-LEVEL ENDPOINTS ----------------- */

/* --------------- POST REQUESTS --------------- */

// Add new data with specified key, value, and action parameters
router.post(
  "/add-new-data/:key/:value/:action",
  // Optional middleware: stores_data_middleware,
  manage_data
);

// Add new data for product suppliers with specified key, value, and action parameters
router.post(
  "/product-suppliers/add-new-data/:key/:value/:action",
  // Optional middleware: stores_data_middleware,
  product_suppliers_manage_data
);

/* --------------- GET REQUESTS --------------- */

// Fetch all data objects for a specified key and value, with a target request key
router.get(
  "/fetch-multiple-data-objects/:key/:value/:keyn_req",
  // Optional middleware: stores_data_middleware,
  fetch_all_data
);

// Search across multiple data objects in all documents based on a search key and value, with a target request key
router.get(
  "/search-multiple-data-objects-in-all-docs/:search_key/:search_value/:keyn_req",
  // Optional middleware: stores_data_middleware,
  search_data_in_all_docs
);

// Search with comparison operators (e.g., greater than, less than) across multiple data objects in all documents
router.get(
  "/search-multiple-data-objects-in-all-docs/:search_key/:comparison_operator/:search_value/:keyn_req",
  // Optional middleware: stores_data_middleware,
  search_data_in_all_docs_with_comparison
);

// Fetch a single data object within an array for a specified primary key and element ID
router.get(
  "/fetch-single-data-objects/:pok/:key/:value/:target_element_id",
  // Optional middleware: stores_data_middleware,
  stores_second_level_fetch_single_data_in_an_array
);

// Fetch multiple data objects within an array for specified primary and target keys and element ID
router.get(
  "/fetch-multiple-data-objects/:pok/:key/:value/:target_element_key/:target_element_id",
  // Optional middleware: stores_data_middleware,
  stores_second_level_fetch_multiple_data_in_an_array
);

/* --------------- PUT REQUESTS --------------- */

// Update a single data object within an array by target element ID
router.put(
  "/update-set-single-data-objects/:pok/:key/:value/:target_element_id",
  // Optional middleware: stores_data_middleware,
  stores_second_level_update_data_in_an_array
);

// Update units sold data within an object by target element ID
router.put(
  "/update-set-single-data-sunits-sold-object/:pok/:key/:value/:target_element_id",
  // Optional middleware: stores_data_middleware,
  stores_second_level_set_units_sold_data_object
);

/* --------------- DELETE REQUESTS --------------- */

// Remove a single data object from an array by target element ID
router.delete(
  "/second-level-pull-single-data-from-array/:pok/:key/:value/:target_element_id",
  // Optional middleware: stores_data_middleware,
  stores_second_level_pull_single_data_from_an_array
);

// Remove multiple data objects from an array based on specified primary keys
router.delete(
  "/second-level-pull-multiple-data-from-array/:pok/:key/:value",
  // Optional middleware: stores_data_middleware,
  stores_second_level_pull_multiple_data_from_an_array
);

/* ----------------- END OF NON-LEVEL ENDPOINTS ----------------- */

module.exports = router;
