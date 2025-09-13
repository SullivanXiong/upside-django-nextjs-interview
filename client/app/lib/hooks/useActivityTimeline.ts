/**
 * Activity Timeline Hook
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { API_ENDPOINTS, DEFAULT_CUSTOMER_ORG_ID } from '../api/config';
import { ActivityTimeline, DashboardRequestParams } from '../api/types';

interface UseActivityTimelineOptions {
  customer_org_id?: string;
  days?: number;
  enabled?: boolean;
}

interface UseActivityTimelineReturn {
  data: ActivityTimeline | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useActivityTimeline({
  customer_org_id = DEFAULT_CUSTOMER_ORG_ID,
  days = 30,
  enabled = true,
}: UseActivityTimelineOptions = {}): UseActivityTimelineReturn {
  const [data, setData] = useState<ActivityTimeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTimeline = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params: DashboardRequestParams = {
        customer_org_id,
        days,
      };

      const response = await apiClient.get<ActivityTimeline>(
        API_ENDPOINTS.ACTIVITY_TIMELINE,
        params
      );

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch activity timeline'));
      console.error('Error fetching activity timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, [customer_org_id, days, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchTimeline,
  };
}