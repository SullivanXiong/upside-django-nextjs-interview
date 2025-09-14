/**
 * API Configuration
 * Central configuration for all API-related settings
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Dashboard endpoints
  DASHBOARD_STATS: '/api/dashboard/stats/',
  ACTIVITY_TIMELINE: '/api/dashboard/activity-timeline/',
  CHANNEL_BREAKDOWN: '/api/dashboard/channel-breakdown/',
  
  // Data endpoints
  RANDOM_EVENTS: '/api/events/random/',
  RANDOM_PEOPLE: '/api/people/random/',
  
  // Paginated endpoints
  ALL_EVENTS: '/api/events/',
  ALL_PEOPLE: '/api/people/',
} as const;

// Default values from the actual data
export const DEFAULT_CUSTOMER_ORG_ID = 'org_4m6zyrass98vvtk3xh5kcwcmaf';
export const DEFAULT_ACCOUNT_ID = 'account_31crr1tcp2bmcv1fk6pcm0k6ag';