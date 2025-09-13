'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkersNew } from './components';
import { defaultChartData, ChartData } from './chartConfig';
import { fetchActivityTimeline } from '@/lib/api';

interface ChartProps {
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [showBids, setShowBids] = useState(false);
  const [chartData, setChartData] = useState<ChartData>(defaultChartData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const customerOrgId = useMemo(() => process.env.NEXT_PUBLIC_CUSTOMER_ORG_ID || 'org_4m6zyrass98vvtk3xh5kcwcmaf', []);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetchActivityTimeline({ customerOrgId, days: 365 });
        const labels: string[] = res.timeline.map((p) => new Date(p.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
        const data: number[] = res.timeline.map((p) => p.count);
        setChartData((prev: ChartData) => ({
          ...prev,
          labels,
          datasets: [
            {
              ...prev.datasets[0],
              data,
            },
          ],
          // Do not attempt to align markers to daily labels; keep defaults for now
          markers: prev.markers,
        }));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load timeline');
      } finally {
        setIsLoading(false);
      }
    };
    loadTimeline();
  }, [customerOrgId]);

  return (
    <ChartContainer className={className}>
      <ChartHeader 
        title="Navigation Minimap"
        showBids={showBids}
        onToggleBids={setShowBids}
      />
      
      {isLoading && (
        <div className="px-4 pb-2 text-sm text-gray-500">Loading activity timeline…</div>
      )}
      {error && (
        <div className="px-4 pb-2 text-sm text-red-600">{error}</div>
      )}

      <ChartWithMarkersNew data={chartData} />
    </ChartContainer>
  );
};

export default Chart;