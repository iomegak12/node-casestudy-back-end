import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    profileId: String,
    businessName: String,
    contactAddress: String,
    creditLimit: Number,
    activeStatus: Boolean,
    email: String,
    phoneNumber: String,
    remarks: String
});

export default CustomerSchema;