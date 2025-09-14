/**
 * Paginated Events Hook
 * Fetches all activity events with pagination from the Django API
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';
import { API_ENDPOINTS, DEFAULT_CUSTOMER_ORG_ID, DEFAULT_ACCOUNT_ID } from '../api/config';
import { PaginatedEventsResponse, PaginatedEventsParams } from '../api/types';

interface UsePaginatedEventsOptions {
  customer_org_id?: string;
  account_id?: string;
  page_size?: number;
  sort_by?: string;
  enabled?: boolean;
}

interface UsePaginatedEventsReturn {
  data: PaginatedEventsResponse | null;
  loading: boolean;
  error: Error | null;
  currentPage: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export function usePaginatedEvents({
  customer_org_id = DEFAULT_CUSTOMER_ORG_ID,
  account_id = DEFAULT_ACCOUNT_ID,
  page_size = 10,
  sort_by = '-timestamp',
  enabled = true,
}: UsePaginatedEventsOptions = {}): UsePaginatedEventsReturn {
  const [data, setData] = useState<PaginatedEventsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params: PaginatedEventsParams = {
        customer_org_id,
        account_id,
        page: currentPage,
        page_size,
        sort_by,
      };

      const response = await apiClient.get<PaginatedEventsResponse>(
        API_ENDPOINTS.ALL_EVENTS,
        params
      );

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch paginated events'));
      console.error('Error fetching paginated events:', err);
    } finally {
      setLoading(false);
    }
  }, [customer_org_id, account_id, currentPage, page_size, sort_by, enabled]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    data,
    loading,
    error,
    currentPage,
    setPage,
    refetch: fetchEvents,
  };
}