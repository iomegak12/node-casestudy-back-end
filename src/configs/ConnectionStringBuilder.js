const DEFAULT_MONGO_HOST = "localhost";
const DEFAULT_MONGO_PORT = "27017";
const DEFAULT_MONGO_DB = "crmsystemdb";

class ConnectionStringBuilder {
    static getConnectionString() {
        let connectionString = process.env.CONNECTION_STRING || "";

        if (connectionString) {
            return connectionString;
        }

        let mongoHost = process.env.MONGO_HOST || DEFAULT_MONGO_HOST;
        let mongoPort = process.env.MONGO_PORT || DEFAULT_MONGO_PORT;
        let mongoDatabase = process.env.MONGO_DB || DEFAULT_MONGO_DB;

        connectionString = `mongodb://${mongoHost}:${mongoPort}/${mongoDatabase}`;

        return connectionString;
    }
}

export default ConnectionStringBuilder;