import { CustomerServiceHost } from './hosting/index.js';
import { HostConfiguration, SSLConfiguration } from './configs/index.js';

class MainClass {
    static async main() {
        try {
            const hostConfiguration = HostConfiguration.getConfiguration();
            
            let customerServiceHost = null;

            if (hostConfiguration.SSL_ENABLED) {
                const sslConfiguration = SSLConfiguration.getConfiguration();
                customerServiceHost = new CustomerServiceHost(
                    hostConfiguration.SERVICE_PORT,
                    hostConfiguration.SSL_ENABLED,
                    sslConfiguration
                );
            } else {
                customerServiceHost = new CustomerServiceHost(hostConfiguration.SERVICE_PORT);
            }

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