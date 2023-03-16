const DEFAULT_SSL_OPTION = false;
const DEFAULT_PORT = 9090;

class HostConfiguration {
    static getConfiguration() {
        const SERVICE_PORT = process.env.SERVICE_PORT || DEFAULT_PORT;
        const SSL_ENABLED = process.env.SSL_ENABLED || DEFAULT_SSL_OPTION;

        return {
            SERVICE_PORT,
            SSL_ENABLED
        };
    }
}

export default HostConfiguration;