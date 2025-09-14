/**
 * All Events for Chart Hook
 * Fetches all activity events for chart visualization
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { API_ENDPOINTS, DEFAULT_CUSTOMER_ORG_ID, DEFAULT_ACCOUNT_ID } from '../api/config';
import { ChartEventsResponse } from '../api/types';

interface UseAllEventsForChartOptions {
  customer_org_id?: string;
  account_id?: string;
  enabled?: boolean;
}

interface UseAllEventsForChartReturn {
  data: ChartEventsResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAllEventsForChart({
  customer_org_id = DEFAULT_CUSTOMER_ORG_ID,
  account_id = DEFAULT_ACCOUNT_ID,
  enabled = true,
}: UseAllEventsForChartOptions = {}): UseAllEventsForChartReturn {
  const [data, setData] = useState<ChartEventsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        customer_org_id,
        account_id,
      };

      const response = await apiClient.get<ChartEventsResponse>(
        API_ENDPOINTS.ALL_EVENTS_CHART,
        params
      );

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch chart events'));
      console.error('Error fetching chart events:', err);
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