import { CustomerService } from "./services/index.js";

class MainClass {
    static async main() {
        try {
            const customerServiceObject = new CustomerService();
            const customerRecords = await customerServiceObject.getCustomers();

            for (const customerRecord of customerRecords) {
                console.log(customerRecord);
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