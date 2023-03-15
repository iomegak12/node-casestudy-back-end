import mongoose from "mongoose";
import CustomerSchema from "./customer-schema.js";

const CustomerModel = mongoose.model("enterprisecustomers", CustomerSchema);

export default CustomerModel;
