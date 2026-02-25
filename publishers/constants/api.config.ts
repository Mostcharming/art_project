// API Configuration for different environments
const ENV = process.env.EXPO_PUBLIC_ENV || "development";

export const API_CONFIG = {
  development: {
    baseUrl: "http://192.168.1.147:3000/api/publishers",
    timeout: 30000,
  },
  production: {
    baseUrl: "https://68.183.44.140/api/publishers",
    timeout: 30000,
  },
};

export const getCurrentApiConfig = () => {
  return API_CONFIG[ENV as keyof typeof API_CONFIG] || API_CONFIG.development;
};

export const getBaseUrl = () => {
  return getCurrentApiConfig().baseUrl;
};
