import mongoose from 'mongoose';
import { ConnectionStringBuilder } from '../configs/index.js';
import { CustomerModel } from '../models/index.js';

const INVALID_CONNECTION_STRING = "Invalid Connection String Specified!";
const INVALID_PROFILE_ID = "Invalid Profile Id Specified!";
const INVALID_CUSTOMER_RECORD = "Invalid Customer Record (Details) Specified!";
const CONNECTION_OPTIONS = {
    useNewUrlParser: true
};

class CustomerService {
    constructor() {
        this.connectionString = ConnectionStringBuilder.getConnectionString();

        if (!this.connectionString) {
            throw new Error(INVALID_CONNECTION_STRING);
        }
    }

    async getCustomers() {
        try {
            await mongoose.connect(this.connectionString);

            const customers = await CustomerModel.find({});

            return customers;
        } catch (error) {
            throw error;
        }
        finally {
            await mongoose.disconnect();
        }
    }

    async getCustomerDetail(profileId) {
        if (!profileId) {
            throw new Error(INVALID_PROFILE_ID);
        }

        try {
            await mongoose.connect(this.connectionString, CONNECTION_OPTIONS);

            const customerDetail = await CustomerModel.findOne({
                profileId: profileId
            });

            return customerDetail;
        }
        catch (error) { throw error; }
        finally {
            await mongoose.disconnect();
        }
    }

    async saveCustomerDetail(customerDetail) {
        const validation = customerDetail &&
            customerDetail.profileId && customerDetail.businessName;

        if (!validation) {
            throw new Error(INVALID_CUSTOMER_RECORD);
        }

        try {
            await mongoose.connect(this.connectionString, CONNECTION_OPTIONS);

            const newCustomerRecord = new CustomerModel({
                profileId: customerDetail.profileId,
                businessName: customerDetail.businessName,
                businessAddress: customerDetail.businessAddress,
                creditLimit: customerDetail.creditLimit,
                activeStatus: customerDetail.activeStatus,
                email: customerDetail.email,
                phoneNumber: customerDetail.phoneNumber,
                remarks: customerDetail.remarks
            });

            const savedRecord = await newCustomerRecord.save();

            return savedRecord;
        } catch (error) {
            throw error;
        } finally {
            await mongoose.disconnect();
        }
    }
}

export default CustomerService;