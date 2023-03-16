import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import bodyparser from 'body-parser';
import morgan from 'morgan';
import { expressjwt } from 'express-jwt';

import { CustomerRouter } from '../routing/index.js';
import { Server } from 'socket.io';
import { AuthConfiguration } from '../configs/index.js';

const INVALID_SERVICE_PORT = 'Invalid Service Port Specified!';
const CUSTOMER_SERVICE_BASE_URL = '/api/v1/customers';
const INVALID_SSL_CONFIGURATION = 'Invalid SSL (Certificate/Private Key) Configuration Specified!';
const PUBLIC_STATIC_URL = '/';
const UNAUTHORIZED = 401;

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

        this.socketIOServer = new Server(this.webServer);
        this.customerRouter = new CustomerRouter(this.socketIOServer);

        this.authConfiguration = AuthConfiguration.getConfiguration();

        this.initializeMiddleware();
    }

    initializeMiddleware() {
        this.app.use(morgan('combined'));
        this.app.use(bodyparser.json());
        this.app.use(this.applyCors);

        this.app.use((error, request, response, next) => {
            if (error.construtor.name === 'UnauthorizedError') {
                response
                    .status(UNAUTHORIZED)
                    .send({
                        errorMessage: 'Unauthorized Request Access!'
                    });

                return;
            }

            next();
        });

        this.app.use(PUBLIC_STATIC_URL, express.static('../public'));

        this.app.use(CUSTOMER_SERVICE_BASE_URL,
            expressjwt({
                secret: this.authConfiguration.AUTH_SECRET_KEY,
                algorithms: ['HS256']
            }));

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