/**
 * API Configuration
 * Centralized configuration for backend API calls
 */

// Get API base URL from environment variable or default to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * API Endpoints
 * All backend endpoints in one place for easy maintenance
 */
export const API_ENDPOINTS = {
  // Health & Info
  HEALTH: '/health',
  ROOT: '/',

  // Authentication & Users
  USERS: '/api/users',
  USERS_ME: '/api/users/me',
  USER_BY_ID: (id) => `/api/users/${id}`,

  // Turfs
  TURFS: '/api/turfs',
  TURF_BY_ID: (id) => `/api/turfs/${id}`,

  // Bookings
  BOOKINGS: '/api/bookings',
  BOOKINGS_WITH_PAYMENT: (checkoutRequestId) => `/api/bookings/?checkout_request_id=${checkoutRequestId}`,
  BOOKING_BY_ID: (id) => `/api/bookings/${id}`,

  // Payments (M-Pesa)
  STK_PUSH: '/api/stkpush',
  CALLBACK: '/api/callback',
  PAYMENT_STATUS: (checkoutRequestId) => `/api/payment-status/${checkoutRequestId}`,

  // Events
  EVENTS: '/api/events',
  EVENT_BY_ID: (id) => `/api/events/${id}`,

  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_BY_ID: (id) => `/api/notifications/${id}`,

  // Dashboard
  DASHBOARD_STATS: '/api/dashboard/stats',
  DASHBOARD_CHART_DATA: '/api/dashboard/chart-data',
};

/**
 * Helper function to build full API URLs
 * @param {string} endpoint - The endpoint path
 * @returns {string} Full URL
 */
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

/**
 * HTTP Client helper with consistent error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} Response data
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Get Authorization header with Firebase token
 * @param {string} token - Firebase ID token
 * @returns {object} Authorization header
 */
export const getAuthHeader = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiClient,
  getAuthHeader,
};
