/**
 * API Types
 */

// Activity Event Types
export interface ActivityEvent {
  id: number;
  customer_org_id: string;
  account_id: string;
  event_id: string;
  timestamp: string;
  activity: string;
  channel: string;
  status: string;
  metadata?: Record<string, any>;
}

// Person Types
export interface Person {
  id: number;
  customer_org_id: string;
  person_id: string;
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  company?: string;
  metadata?: Record<string, any>;
}

// Dashboard Stats Types
export interface DashboardStats {
  total_events: number;
  total_people: number;
  recent_events: number;
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
  channel_breakdown: Array<{
    channel: string;
    count: number;
  }>;
  date_range: {
    start: string;
    end: string;
    days: number;
  };
}

// Activity Timeline Types
export interface ActivityTimeline {
  timeline: Array<{
    day: string;
    count: number;
  }>;
  date_range: {
    start: string;
    end: string;
    days: number;
  };
}

// Channel Breakdown Types
export interface ChannelBreakdown {
  breakdown: Array<{
    channel: string;
    status: string;
    count: number;
  }>;
  date_range: {
    start: string;
    end: string;
    days: number;
  };
}

// Request Parameters
export interface DashboardRequestParams {
  customer_org_id: string;
  days?: number;
}

export interface EventsRequestParams {
  customer_org_id: string;
  account_id: string;
}

export interface PeopleRequestParams {
  customer_org_id: string;
}