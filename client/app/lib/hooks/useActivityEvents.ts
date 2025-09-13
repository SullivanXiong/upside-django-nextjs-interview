/**
 * Activity Events Hook
 * Fetches activity events from the Django API
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { API_ENDPOINTS, DEFAULT_CUSTOMER_ORG_ID, DEFAULT_ACCOUNT_ID } from '../api/config';
import { ActivityEvent, EventsRequestParams } from '../api/types';

interface UseActivityEventsOptions {
  customer_org_id?: string;
  account_id?: string;
  enabled?: boolean;
}

interface UseActivityEventsReturn {
  data: ActivityEvent[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useActivityEvents({
  customer_org_id = DEFAULT_CUSTOMER_ORG_ID,
  account_id = DEFAULT_ACCOUNT_ID,
  enabled = true,
}: UseActivityEventsOptions = {}): UseActivityEventsReturn {
  const [data, setData] = useState<ActivityEvent[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params: EventsRequestParams = {
        customer_org_id,
        account_id,
      };

      const response = await apiClient.get<ActivityEvent[]>(
        API_ENDPOINTS.RANDOM_EVENTS,
        params
      );

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activity events'));
      console.error('Error fetching activity events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [customer_org_id, account_id, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchEvents,
  };
}