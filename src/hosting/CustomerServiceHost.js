import express from 'express';
import http from 'http';
import bodyparser from 'body-parser';
import { CustomerRouter } from '../routing/index.js';
import morgan from 'morgan';

const INVALID_SERVICE_PORT = 'Invalid Service Port Specified!';
const CUSTOMER_SERVICE_BASE_URL = '/api/v1/customers';

class CustomerServiceHost {
    constructor(portNumber) {
        if (!portNumber) {
            throw new Error(INVALID_SERVICE_PORT);
        }

        this.portNumber = portNumber;

        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.customerRouter = new CustomerRouter();

        this.initializeMiddleware();
    }

    initializeMiddleware() {
        this.app.use(morgan('combined'));
        this.app.use(bodyparser.json());
        this.app.use(this.applyCors);
        this.app.use(CUSTOMER_SERVICE_BASE_URL, this.customerRouter.Router);
    }

    applyCors(request, response, next) {
        response.header('Access-Control-Allow-Credentials', 'true');
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Methods', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        next();
    }

    startServer() {
        const promise = new Promise((resolve, reject) => {
            try {
                this.httpServer.listen(
                    this.portNumber, () => resolve());
            } catch (error) {
                reject(error);
            }
        });

        return promise;
    }

    stopServer() {
        const promise = new Promise((resolve, reject) => {
            try {
                this.httpServer.close(() => resolve());
            } catch (error) {
                reject(error);
            }
        });

        return promise;
    }
}

export default CustomerServiceHost;