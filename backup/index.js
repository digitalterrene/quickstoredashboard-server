// else if (action === "update") {
//         try {
//           const newly_updated_element = await db
//             .collection("dashboards")
//             .updateOne(
//               {
//                 ...query,
//                 [`${req.body.key_to_update}._id`]: element_id,
//               },
//               {
//                 $set: {
//                   [`${req.body.key_to_update}.$.name`]: "New Name", // Values to set
//                 },
//               }
//             );
//           // const newly_updated_element = await db
//           //   .collection("dashboards")
//           //   .updateOne(
//           //     ...query,
//           //     {},
//           //     {
//           //       $set: {
//           //         [`${req.body.key_to_update}.$._id`]: element_id, // Field to update
//           //         ...req.body.value_to_update, // Values to set
//           //       },
//           //     }
//           //   );

//           if (
//             newly_updated_element &&
//             newly_updated_element.modifiedCount > 0
//           ) {
//             return res.status(200).json({
//               message: `Successfully updated from ${req.body.value_to_update?.data_type}`,
//             });
//           } else {
//             console.log("Failed to update element");
//             return res.status(400).json({
//               error: `Failed to update from ${req.body.value_to_update?.data_type}`,
//             });
//           }
//         } catch (error) {
//           //console.error("Error occurred during update operation:", error);
//           return res
//             .status(404)
//             .json({ error: "The targeted document was not found" });
//         }
//       }
////////////////////////////////////////////////////////////////////////////////////////////////////////
// else if (action === "update") {
//         try {
//           const { key_to_update, value_to_update } = req.body;

//           // Exclude data_type from value_to_update
//           const { data_type, ...otherData } = value_to_update;
//           const object_to_update = otherData;

//           const updatePromises = Object.entries(object_to_update).map(
//             async ([key, value]) => {
//               try {
//                 const newly_updated_element = await db
//                   .collection("dashboards")
//                   .updateOne(
//                     {
//                       ...query,
//                       [`${key_to_update}._id`]: element_id,
//                     },
//                     {
//                       $set: {
//                         [`${key_to_update}.$.${key}`]: value,
//                       },
//                     }
//                   );

//                 if (
//                   newly_updated_element &&
//                   newly_updated_element.modifiedCount > 0
//                 ) {
//                   return {
//                     success: true,
//                     message: `Successfully updated ${key}`,
//                   };
//                 } else {
//                   console.log(`Failed to update ${key}`);
//                   return { success: false, error: `Failed to update ${key}` };
//                 }
//               } catch (error) {
//                 console.error("Error occurred during update operation:", error);
//                 return {
//                   success: false,
//                   error: `Error updating ${key}: ${error.message}`,
//                 };
//               }
//             }
//           );

//           const results = await Promise.all(updatePromises);
//           // Check if any update failed
//           const failedUpdates = results.filter((result) => !result.success);
//           if (failedUpdates.length > 0) {
//             return res
//               .status(400)
//               .json({ errors: failedUpdates.map((update) => update.error) });
//           } else {
//             return res
//               .status(200)
//               .json({ message: "All fields updated successfully" });
//           }
//         } catch (error) {
//           console.error("Error occurred during update operation:", error);
//           return res.status(500).json({ error: "Internal server error" });
//         }
//       }
