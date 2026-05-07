// API Configuration for different environments
const ENV = process.env.EXPO_PUBLIC_ENV || "production";

export const API_CONFIG = {
  development: {
    baseUrl: "http://192.168.1.147:3000/api/publishers",
    timeout: 30000,
  },
  production: {
    baseUrl: "https://joincarsl.com/api/publishers",
    timeout: 30000,
  },
};

export const getCurrentApiConfig = () => {
  return API_CONFIG[ENV as keyof typeof API_CONFIG] || API_CONFIG.production;
};

export const getBaseUrl = () => {
  return getCurrentApiConfig().baseUrl;
};
