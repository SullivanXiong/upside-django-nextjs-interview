/**
 * Dashboard Stats Hook
 * Fetches dashboard statistics including totals and breakdowns from the Django API
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { API_ENDPOINTS, DEFAULT_CUSTOMER_ORG_ID } from '../api/config';
import { DashboardStats, DashboardRequestParams } from '../api/types';

interface UseDashboardStatsOptions {
  customer_org_id?: string;
  days?: number;
  enabled?: boolean;
}

interface UseDashboardStatsReturn {
  data: DashboardStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats({
  customer_org_id = DEFAULT_CUSTOMER_ORG_ID,
  days = 30,
  enabled = true,
}: UseDashboardStatsOptions = {}): UseDashboardStatsReturn {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params: DashboardRequestParams = {
        customer_org_id,
        days,
      };

      const response = await apiClient.get<DashboardStats>(
        API_ENDPOINTS.DASHBOARD_STATS,
        params
      );

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard stats'));
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [customer_org_id, days, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}