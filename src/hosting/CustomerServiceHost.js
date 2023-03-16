import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import bodyparser from 'body-parser';
import { CustomerRouter } from '../routing/index.js';
import morgan from 'morgan';

const INVALID_SERVICE_PORT = 'Invalid Service Port Specified!';
const CUSTOMER_SERVICE_BASE_URL = '/api/v1/customers';
const INVALID_SSL_CONFIGURATION = 'Invalid SSL (Certificate/Private Key) Configuration Specified!';

class CustomerServiceHost {
    constructor(portNumber, isSSLEnabled = false, sslConfiguration = {}) {
        if (!portNumber) {
            throw new Error(INVALID_SERVICE_PORT);
        }

        this.portNumber = portNumber;
        this.app = express();

        let webServer = null;

        if (isSSLEnabled) {
            const sslCertificationValidation = sslConfiguration &&
                sslConfiguration.PRIVATE_KEY_FILE &&
                sslConfiguration.PRIVATE_KEY_PASS &&
                sslConfiguration.PUBLIC_CERT_FILE;

            if (!sslCertificationValidation) {
                throw new Error(INVALID_SSL_CONFIGURATION);
            }

            this.webServer = https.createServer({
                cert: fs.readFileSync(sslConfiguration.PUBLIC_CERT_FILE, 'utf8'),
                key: fs.readFileSync(sslConfiguration.PRIVATE_KEY_FILE, 'utf8'),
                passphrase: sslConfiguration.PRIVATE_KEY_PASS
            }, this.app);
        } else {
            this.webServer = http.createServer(this.app);
        }

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
                this.webServer.listen(
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
                this.webServer.close(() => resolve());
            } catch (error) {
                reject(error);
            }
        });

        return promise;
    }
}

export default CustomerServiceHost;