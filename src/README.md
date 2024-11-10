# Dashboard Server

Welcome to the **Dashboard Server**! 🎉 This server is designed to streamline the creation and management of multiple dashboards by centralizing user accounts and data across different dashboard types. Whether you're managing a dashboard for your blog, office, or online store, this server enables you to handle everything from one central location. 🌐

---

## Overview

The Dashboard Server centralizes and simplifies dashboard creation, eliminating the need for separate servers for each dashboard application. By managing different dashboard types (e.g., `server.blogs.quickstoredashboard.com`, `server.office.quickstoredashboard.com`) on a single server, we reduce redundancy and increase operational efficiency.

The server is structured around two primary components:

1. **Accounts Collection**: Manages user accounts across various dashboard types. Each user is uniquely identified by a `user_id`, which links to the data stored in other collections.
2. **Data Collection**: Stores all user-generated data, regardless of the dashboard type. Data entries include a `dashboard_type` identifier (e.g., `sites`, `office`, `stores`) and a `user_id` to associate data with the user.

With this structure, multiple dashboards (e.g., `dashboards.quickstoredashboard.com`, `specific_dashboard.dashboards.com`) can be managed centrally. This approach simplifies both backend and frontend operations while keeping the frontend dashboard panel under development. 🚀

---

## Data Structure

The data is organized in the following structure:

````css
dashboards -> Creates and fetches accounts based on user_id
dashboard.dashboards -> Manages data of different dashboard types (e.g., sites, office, stores)
specific_dashboard: {
  admin_details,
  basic_details,
  social_details,
  data# Dashboard Server

Welcome to the **Dashboard Server**! 🎉 This server is designed to streamline the creation and management of multiple dashboards by centralizing user accounts and data across different dashboard types. Whether you're managing a dashboard for your blog, office, or online store, this server enables you to handle everything from one central location. 🌐

---

## Overview

The Dashboard Server centralizes and simplifies dashboard creation, eliminating the need for separate servers for each dashboard application. By managing different dashboard types (e.g., `server.blogs.quickstoredashboard.com`, `server.office.quickstoredashboard.com`) on a single server, we reduce redundancy and increase operational efficiency.

The server is structured around two primary components:

1. **Accounts Collection**: Manages user accounts across various dashboard types. Each user is uniquely identified by a `user_id`, which links to the data stored in other collections.
2. **Data Collection**: Stores all user-generated data, regardless of the dashboard type. Data entries include a `dashboard_type` identifier (e.g., `sites`, `office`, `stores`) and a `user_id` to associate data with the user.

With this structure, multiple dashboards (e.g., `dashboards.quickstoredashboard.com`, `specific_dashboard.dashboards.com`) can be managed centrally. This approach simplifies both backend and frontend operations while keeping the frontend dashboard panel under development. 🚀

---

## Data Structure

The data is organized in the following structure:

```css
dashboards -> Creates and fetches accounts based on user_id
dashboard.dashboards -> Manages data of different dashboard types (e.g., sites, office, stores)
specific_dashboard: {
  admin_details,
  basic_details,
  social_details,
   {
    [key]: data
  }
}
````

This structure ensures efficient management of user accounts and their associated data, enabling easy retrieval and modification across all types of dashboards.

---

## API Documentation

The server provides RESTful API endpoints to manage dashboard data, supporting **POST**, **GET**, **PUT**, and **DELETE** requests.

### **POST Requests** 🚀

#### Add New Data

- **Endpoint**: `/add-new-data/:key/:value/:action`
- **Description**: Adds new data to the specified collection.
- **Parameters**:
  - `key`: Key for the data being added.
  - `value`: Value for the data.
  - `action`: Specifies the type of addition or modification.
- **Middleware**: Currently disabled (`// stores_data_middleware`).

#### Add New Data for Product Suppliers

- **Endpoint**: `/product-suppliers/add-new-data/:key/:value/:action`
- **Description**: Adds new data specifically related to product suppliers.
- **Parameters**: Same as above.

---

### **GET Requests** 📥

#### Fetch Multiple Data Objects

- **Endpoint**: `/fetch-multiple-data-objects/:key/:value/:keyn_req`
- **Description**: Retrieves multiple data objects based on filters.
- **Parameters**:
  - `key`: Primary filter key.
  - `value`: Filter value.
  - `keyn_req`: Additional required key.

#### Search Multiple Data Objects in All Documents

- **Endpoint**: `/search-multiple-data-objects-in-all-docs/:search_key/:search_value/:keyn_req`
- **Description**: Searches all documents using specified key-value pairs.
- **Parameters**:
  - `search_key`: Key to search for.
  - `search_value`: Value to match.
  - `keyn_req`: Additional required key.

#### Search Data with Comparison Operator

- **Endpoint**: `/search-multiple-data-objects-in-all-docs/:search_key/:comparison_operator/:search_value/:keyn_req`
- **Description**: Searches documents with a comparison operator (e.g., `<`, `>`, `=`).
- **Parameters**:
  - `search_key`: Key to search for.
  - `comparison_operator`: Operator for comparison.
  - `search_value`: Value to compare.
  - `keyn_req`: Additional required key.

#### Fetch Single Data Object

- **Endpoint**: `/fetch-single-data-objects/:pok/:key/:value/:target_element_id`
- **Description**: Retrieves a single data object based on a unique identifier.
- **Parameters**:
  - `pok`: Primary key.
  - `key`: Secondary filter key.
  - `value`: Filter value.
  - `target_element_id`: Target ID to fetch.

#### Fetch Multiple Data Objects in Array

- **Endpoint**: `/fetch-multiple-data-objects/:pok/:key/:value/:target_element_key/:target_element_id`
- **Description**: Retrieves multiple data objects within an array based on key identifiers.
- **Parameters**:
  - `pok`: Primary key.
  - `key`: Secondary filter key.
  - `value`: Filter value.
  - `target_element_key`: Array key.
  - `target_element_id`: Array element ID to fetch.

---

### **PUT Requests** 🛠️

#### Update Single Data Object

- **Endpoint**: `/update-set-single-data-objects/:pok/:key/:value/:target_element_id`
- **Description**: Updates a single data object in an array.
- **Parameters**: Same as in **GET** requests.

#### Update Units Sold in Data Object

- **Endpoint**: `/update-set-single-data-sunits-sold-object/:pok/:key/:value/:target_element_id`
- **Description**: Specifically updates the units sold within a data object.
- **Parameters**: Same as above.

---

### **DELETE Requests** 🗑️

#### Delete Single Data from Array

- **Endpoint**: `/second-level-pull-single-data-from-array/:pok/:key/:value/:target_element_id`
- **Description**: Removes a single data entry from an array.
- **Parameters**: Same as in **PUT** requests.

#### Delete Multiple Data from Array

- **Endpoint**: `/second-level-pull-multiple-data-from-array/:pok/:key/:value`
- **Description**: Removes multiple entries from an array.
- **Parameters**:
  - `pok`: Primary key.
  - `key`: Secondary filter key.
  - `value`: Filter value.

---

## Summary 🎯

The **Dashboard Server** simplifies the management of multiple dashboards by centralizing user accounts and data. It provides a flexible and scalable structure to handle various dashboard applications with ease. The provided API allows you to efficiently manage dashboard data, supporting complex filtering, modification, and retrieval operations. This approach reduces development time, minimizes server redundancy, and ensures a smooth experience for managing multiple types of dashboards.

Stay tuned as the front-end dashboard panel is still under development! ✨

---

**Happy dashboard managing!** 🌟
