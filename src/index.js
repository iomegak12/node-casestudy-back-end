import { CustomerServiceHost } from './hosting/index.js';
import { HostConfiguration } from './configs/index.js';

class MainClass {
    static async main() {
        try {
            const hostConfiguration = HostConfiguration.getConfiguration();

            const customerServiceHost = new CustomerServiceHost(
                hostConfiguration.SERVICE_PORT);

            await customerServiceHost.startServer();

            console.info('Customer Service Host Started Successfully!');

            const stopHost = async () => {
                await customerServiceHost.stopServer();
                console.info('Customer Service Host Stopped Successfully!');
            };

            process.on('exit', stopHost);
            process.on('SIGINT', stopHost);
        } catch (error) {
            console.error(`Error Occurred, Details : ${error}`);
        }
    }
}

MainClass
    .main();