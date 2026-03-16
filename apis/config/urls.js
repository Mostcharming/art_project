

const urlConfig = {
    development: 'http://192.168.1.147:3000',
    production: 'https://joincarsl.com/api',
    test: 'http://192.168.1.147:3000'
};

const currentEnv = process.env.NODE_ENV || 'development';
const backendUrl = urlConfig[currentEnv];

module.exports = {
    backendUrl,
    urlConfig,
    getBackendUrl: (env = currentEnv) => urlConfig[env] || urlConfig.development
};
