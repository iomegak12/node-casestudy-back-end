const DEFAULT_SECRET_KEY = 'Prestige123$$/??';

class AuthConfiguration {
    static getConfiguration() {
        const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || DEFAULT_SECRET_KEY;

        return {
            AUTH_SECRET_KEY
        };
    }
}

export default AuthConfiguration;