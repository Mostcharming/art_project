/**
 * API Configuration & Constants
 * Centralized API endpoint definitions for your entire application
 */

// API Base URLs - Configure these for your environment
export const API_CONFIG = {
  development: {
    baseURL: "http://localhost:3000",
    timeout: 30000,
  },
  production: {
    baseURL: process.env.VITE_API_URL || "https://api.yourapp.com",
    timeout: 30000,
  },
};

// Get the appropriate config based on environment
export const getApiConfig = () => {
  const isDev = import.meta.env.DEV;
  return isDev ? API_CONFIG.development : API_CONFIG.production;
};

/**
 * API Endpoints - Organized by feature
 */
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    register: "/api/auth/register",
    refreshToken: "/api/auth/refresh",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    verifyEmail: "/api/auth/verify-email",
  },

  // Admin Management
  admins: {
    list: "/api/admins",
    create: "/api/admins",
    getById: (id: string) => `/api/admins/${id}`,
    update: (id: string) => `/api/admins/${id}`,
    delete: (id: string) => `/api/admins/${id}`,
    profile: "/api/admins/profile",
    updateProfile: "/api/admins/profile",
    changePassword: "/api/admins/password",
    uploadAvatar: "/api/admins/avatar",
  },

  // Publisher Management
  publishers: {
    list: "/api/publishers",
    create: "/api/publishers",
    getById: (id: string) => `/api/publishers/${id}`,
    update: (id: string) => `/api/publishers/${id}`,
    delete: (id: string) => `/api/publishers/${id}`,
    getSettings: (id: string) => `/api/publishers/${id}/settings`,
    updateSettings: (id: string) => `/api/publishers/${id}/settings`,
    uploadLogo: "/api/publishers/logo",
    analytics: (id: string) => `/api/publishers/${id}/analytics`,
  },

  // Viewer Management
  viewers: {
    list: "/api/viewers",
    create: "/api/viewers",
    getById: (id: string) => `/api/viewers/${id}`,
    update: (id: string) => `/api/viewers/${id}`,
    delete: (id: string) => `/api/viewers/${id}`,
    profile: "/api/viewers/profile",
    updateProfile: "/api/viewers/profile",
    preferences: "/api/viewers/preferences",
    updatePreferences: "/api/viewers/preferences",
  },

  // Content Management
  content: {
    styles: {
      list: "/api/styles",
      create: "/api/styles",
      getById: (id: string) => `/api/styles/${id}`,
      update: (id: string) => `/api/styles/${id}`,
      delete: (id: string) => `/api/styles/${id}`,
    },
    favorites: {
      list: "/api/favorites",
      create: "/api/favorites",
      delete: (id: string) => `/api/favorites/${id}`,
    },
  },

  // File Upload
  uploads: {
    image: "/api/uploads/image",
    document: "/api/uploads/document",
    avatar: "/api/uploads/avatar",
  },
};

/**
 * HTTP Status Codes with messages
 */
export const HTTP_STATUS = {
  OK: { code: 200, message: "Success" },
  CREATED: { code: 201, message: "Resource created" },
  BAD_REQUEST: { code: 400, message: "Bad request" },
  UNAUTHORIZED: { code: 401, message: "Unauthorized - Please login" },
  FORBIDDEN: { code: 403, message: "Forbidden" },
  NOT_FOUND: { code: 404, message: "Resource not found" },
  CONFLICT: { code: 409, message: "Conflict" },
  INTERNAL_ERROR: { code: 500, message: "Internal server error" },
  SERVICE_UNAVAILABLE: { code: 503, message: "Service unavailable" },
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT: "Request timeout. Please try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  UNAUTHORIZED: "Your session has expired. Please login again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "An error occurred on the server. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
};
