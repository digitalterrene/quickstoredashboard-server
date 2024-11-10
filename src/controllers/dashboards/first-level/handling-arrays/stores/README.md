# quickstoredashboard Stores Dashboard Documentation

Welcome to the quickstoredashboard Stores Dashboard Documentation. This guide will walk you through the restrictions and verification processes involved in upserting data for the various entities within the dashboard.

## Overview

The quickstoredashboard Stores Dashboard manages data for various entities including inventory, orders, sales, invoices, transactions, expenses, refunds, stakeholders, and customers. Each entity has specific dependencies and restrictions which must be adhered to when upserting data to ensure data integrity and accuracy.

## Upserting Process

The upserting process involves inserting new data or updating existing data. However, certain entities have dependencies on others, requiring verification of the existence of related data before insertion or update.

### Independent Entities

Independent entities can be created alone without checking for the existence of their ID in another folder's entries.

1. **Inventory**
2. **Orders**
3. **Stakeholders**

### Dependent Entities

Dependent entities require verification of the existence of related data before creation.

| Dependent Entity | Dependencies            |
| ---------------- | ----------------------- |
| Products         | Depends on Inventory    |
| Sales            | Depends on Orders       |
| Invoices         | Depends on Sales        |
| Transactions     | Depends on Stakeholders |
| Expenses         | Depends on Transactions |
| Refunds          | Depends on Sales        |
| Customers        | Depends on Stakeholders |

## Dependencies

1. **Products**: Requires existing inventory entries.
2. **Sales**: Requires existing order entries.
3. **Invoices**: Requires existing sales entries.
4. **Transactions**: Requires existing stakeholders entries.
5. **Expenses**: Requires existing transaction entries.
6. **Refunds**: Requires existing sales entries.
7. **Customers**: Requires existing stakeholders entries.

## Example Workflow

To illustrate the upserting process, consider the following scenario:

1. A new inventory item is added to the system.
2. The system verifies the existence of the inventory item.
3. A new product is created, utilizing the inventory item.
4. A customer places an order for the product.
5. The system verifies the existence of the order.
6. A sale is generated based on the order.
7. An invoice is created for the sale.
8. Transactions are recorded for the stakeholders involved.
9. Expenses related to the transactions are logged.
10. Refunds are processed if necessary.

## Conclusion

By understanding the dependencies and restrictions outlined in this documentation, users can effectively manage data within the quickstoredashboard Stores Dashboard while ensuring data integrity and accuracy. If you have any further questions or require assistance, please refer to the relevant sections of this documentation or contact support for assistance.

# Middleware: `stores_data_middleware`

- **Purpose**: This middleware is responsible for verifying the existence of related data before performing actions such as insertion or update.
- **Input**:
  - `req.params`: Contains parameters like `key` and `value` used for querying data.
  - `req.headers`: Contains the `verifying_id` which is used to verify the existence of related data and later stores the `aproved_data_type`.
  - `req.body.value_to_update.data_type`: Specifies the type of data being updated.
- **Steps**:
  1. Validate input parameters.
  2. Determine the verifying category based on the provided data type.
  3. Query the database to verify the existence of related data.
  4. If data exists, store the approved data type in the request headers.
  5. Proceed to the next middleware if verification is successful, otherwise, return an error response.

# API Endpoint: `manage_data`

- **Purpose**: This API endpoint is responsible for managing data within the Stores Dashboard based on approved data types.
- **Input**:
  - `req.params`: Contains parameters like `action`, `key`, and `value` used for querying data and specifying the action to be performed.
  - `req.headers`: Contains the `aproved_data_type` used to validate the action.
  - `req.body`: Contains additional data required for performing actions like adding to a set or pulling data.
- **Steps**:
  1. Validate input parameters and approved data type.
  2. Perform the specified action (`add_to_set` or `pull`) based on the approved data type.
  3. Update the database accordingly.
  4. Return success message if the action is performed successfully, otherwise return an error response.

## Conclusion

By implementing this middleware and API, the Stores Dashboard can effectively enforce dependencies and restrictions specified in the documentation, ensuring data integrity and accuracy.
