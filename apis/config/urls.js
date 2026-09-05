

const urlConfig = {
    development: process.env.BACKEND_URL || 'http://localhost:3000',
    production: 'https://joincarsl.com/api',
    test: process.env.BACKEND_URL || 'http://localhost:3000'
};

const currentEnv = process.env.NODE_ENV || 'development';
const backendUrl = urlConfig[currentEnv];

module.exports = {
    backendUrl,
    urlConfig,
    getBackendUrl: (env = currentEnv) => urlConfig[env] || urlConfig.development
};
