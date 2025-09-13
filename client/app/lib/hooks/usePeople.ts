/**
 * People Hook
 */

import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { API_ENDPOINTS, DEFAULT_CUSTOMER_ORG_ID } from '../api/config';
import { Person, PeopleRequestParams } from '../api/types';

interface UsePeopleOptions {
  customer_org_id?: string;
  enabled?: boolean;
}

interface UsePeopleReturn {
  data: Person[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function usePeople({
  customer_org_id = DEFAULT_CUSTOMER_ORG_ID,
  enabled = true,
}: UsePeopleOptions = {}): UsePeopleReturn {
  const [data, setData] = useState<Person[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPeople = async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const params: PeopleRequestParams = {
        customer_org_id,
      };

      const response = await apiClient.get<Person[]>(
        API_ENDPOINTS.RANDOM_PEOPLE,
        params
      );

      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch people'));
      console.error('Error fetching people:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, [customer_org_id, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchPeople,
  };
}