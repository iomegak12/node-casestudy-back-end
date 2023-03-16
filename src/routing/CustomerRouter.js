import express from 'express';
import { CustomerService } from '../services/index.js';

const HTTP_OK = 200;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const SERVER_ERROR = 500;
const RECORD_CREATED = 201;
const NEW_CUSTOMER_RECORD = 'NewCustomerRecord';

class CustomerRouter {
    constructor(socketIOServer) {
        this.customerRouter = express.Router();
        this.customerService = new CustomerService();
        this.socketIOServer = socketIOServer;

        this.initializeRouting();
    }

    initializeRouting() {
        this.customerRouter.get('/', async (request, response) => {
            try {
                const customers = await this.customerService.getCustomers();

                response
                    .status(HTTP_OK)
                    .send(customers);
            } catch (error) {
                response
                    .status(SERVER_ERROR)
                    .send({
                        errorMessage: error.message
                    });
            }
        });

        this.customerRouter.get('/detail/:profileId', async (request, response) => {
            const profileId = request.params.profileId;

            if (!profileId) {
                response
                    .status(BAD_REQUEST)
                    .send({
                        errorMessage: 'Invalid Profile Id Specified!'
                    });

                return;
            }

            try {
                const customerProfile = await this.customerService.getCustomerDetail(profileId);

                if (!customerProfile) {
                    response
                        .status(NOT_FOUND)
                        .send({
                            errorMessage: 'Specified Profile Not Found!'
                        });

                    return;
                }

                response
                    .status(HTTP_OK)
                    .send(customerProfile);
            } catch (error) {
                response
                    .status(SERVER_ERROR)
                    .send({
                        errorMessage: error.message
                    });
            }
        });

        this.customerRouter.post('/', async (request, response) => {
            const requestBody = request.body;
            const validation = requestBody &&
                requestBody.profileId &&
                requestBody.businessName;

            if (!validation) {
                response
                    .status(BAD_REQUEST)
                    .send({
                        errorMessage: 'Invalid Customer Request Details Specified!'
                    });

                return;
            }

            try {
                const addedRecord = await this.customerService.saveCustomerDetail(requestBody);

                if (!addedRecord) {
                    response
                        .status(SERVER_ERROR)
                        .send({
                            errorMessage: 'Unable to Process Customer Record!'
                        });

                    return;
                }

                if(this.socketIOServer) {
                    this.socketIOServer.emit(NEW_CUSTOMER_RECORD, addedRecord);
                }

                response
                    .status(RECORD_CREATED)
                    .send(addedRecord);
            } catch (error) {
                response
                    .status(SERVER_ERROR)
                    .send({
                        errorMessage: error.message
                    });
            }
        });
    }

    get Router() {
        return this.customerRouter;
    }
}

export default CustomerRouter;