import { CustomerService } from "./services/index.js";

class MainClass {
    static async main() {
        try {
            const customerServiceObject = new CustomerService();

            // const newRecord = {
            //     profileId: "PROF10001",
            //     businessName: "Northwind Traders",
            //     contactAddress: "Bangalore",
            //     creditLimit: 23000,
            //     activeStatus: true,
            //     email: "info@nwt.com",
            //     phoneNumber: "080-39849384",
            //     remarks: "Simple Customer Record"
            // };

            // const savedRecord = await customerServiceObject.saveCustomerDetail(newRecord);

            // console.log(savedRecord);

            // console.log("Retrieving Records ...");

            // const customerRecords = await customerServiceObject.getCustomers();

            // for (const customerRecord of customerRecords) {
            //     console.log(customerRecord.profileId);
            // }

            console.log("Retrieving Records Specific ...");

            const filtedCustomerRecords = await customerServiceObject.getCustomerDetail('PROF10001');

            for (const customerRecord of customerRecords) {
                console.log(customerRecord.businessName);
            }
        } catch (error) {
            console.error(`Error Occurred, Details : ${error}`);
        }
    }
}

MainClass
    .main()
    .then(() => console.log('Program completed!'))
    .catch(error => console.log('Something went wrong!'));