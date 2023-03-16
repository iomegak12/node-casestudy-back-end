const DEFAULT_PRIVATE_KEY_FILE = './ssl/privatekey.key';
const DEFAULT_PUBLIC_CERT_FILE = './ssl/certificate.crt';
const DEFAULT_PRIVATE_KEY_PASS = 'Prestige123$$';

class SSLConfiguration {
    static getConfiguration() {
        const PRIVATE_KEY_FILE = process.env.PRIVATE_KEY_FILE || DEFAULT_PRIVATE_KEY_FILE;
        const PUBLIC_CERT_FILE = process.env.PUBLIC_CERT_FILE || DEFAULT_PUBLIC_CERT_FILE;
        const PRIVATE_KEY_PASS = process.env.PRIVATE_KEY_PASS || DEFAULT_PRIVATE_KEY_PASS;

        return {
            PRIVATE_KEY_FILE,
            PRIVATE_KEY_PASS,
            PUBLIC_CERT_FILE
        };
    }
}

export default SSLConfiguration;