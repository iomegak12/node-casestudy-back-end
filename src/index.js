import { ConnectionStringBuilder } from "./configs/index.js";

class MainClass {
    static main() {
        let connectionString = ConnectionStringBuilder.getConnectionString();

        console.info(`Connection String: ${connectionString}`);
    }
}

MainClass.main();