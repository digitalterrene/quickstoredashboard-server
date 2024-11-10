const _data_ = {
//keys for data_type === 'products' start here
image: "",
name: "",
description: "",
category: "",
industry: "",
status: "",
in_stock: "",
price,
//keys for data_type === 'products' ends here
//keys for data_type === 'orders' start here
image: "",
name: "",
status: "",
units: "",
unit_price: "",
total_price: "",
buyer: {
image: "",
name: "name",
\_id: "",
},
//keys for data_type === 'orders' end here
//keys for data_type === 'sales' start here
image: "",
name: "",
status: "",
units: "",
payment_method: "",
total_price: "",
location: {
address: "",
zip_code: "name",
city: "",
state: "",
country: "",
},
buyer: {
image: "",
name: "name",
\_id: "",
},
delivery_method: "",
//keys for data_type === 'sales' end here
//keys for data_type === 'custmers' start here
image: "",
name: "",
products: [
{
image: "",
name: "name",
_id: "",
},
],
value: "",
status: "",
location: {
address: "",
zip_code: "name",
city: "",
state: "",
country: "",
},
contact: {
email: "",
whatsapp: "name",
phone: "",
},
//keys for data_type === 'custmers' start here
};

db.tests.updateOne(
{ _id: ObjectId("657ccfa19b679e45eb2302ad") },
{
$push: { "\_data_.products": { name: "name", _id: "\_id" } },
}
);
db.tests.updateOne(
{ \_id: ObjectId("657ccfa19b679e45eb2302ad") },
{ $set: { "orders.$[o].orderItems.$[i].quantity": "sss" } },
{ arrayFilters: [{ "o._id": "i" }, { "i._id": "new-" }] }
);
db.tests.updateOne(
{ \_id: ObjectId("657ccfa19b679e45eb2302ad") },
{ $set: { "\_data_.products.$[o].name": "sss" } },
{ arrayFilters: [{ "o._id": "_id" }] }
);
