'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkersNew } from './components';
import { ChartData } from './chartConfig';
import { fetchJson, getDefaultIdentifiers } from '@/lib/api';

interface ChartProps {
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [showBids, setShowBids] = useState(false);
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [], markers: [] });
  const [error, setError] = useState<string | null>(null);

  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }), []);

  useEffect(() => {
    const { customerOrgId } = getDefaultIdentifiers();
    const params = new URLSearchParams({ customer_org_id: customerOrgId, days: String(365) });

    fetchJson<{ timeline: { day: string; count: number }[] }>(`/api/dashboard/activity-timeline/?${params.toString()}`)
      .then((resp) => {
        const byMonth = new Map<string, number>();
        for (const item of resp.timeline) {
          const d = new Date(item.day);
          const key = monthFormatter.format(d);
          byMonth.set(key, (byMonth.get(key) || 0) + item.count);
        }
        const labels = Array.from(byMonth.keys());
        const data = labels.map((l) => byMonth.get(l) || 0);
        const markers = labels.map((l) => ({ month: l, label: '', position: 0 }));
        setChartData({
          labels,
          datasets: [
            {
              label: 'Activity',
              data,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              pointBackgroundColor: '#3b82f6',
              pointBorderColor: '#3b82f6',
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.4,
              fill: true,
            },
          ],
          markers,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load chart'));
  }, [monthFormatter]);

  return (
    <ChartContainer className={className}>
      <ChartHeader 
        title="Navigation Minimap"
        showBids={showBids}
        onToggleBids={setShowBids}
      />
      
      <ChartWithMarkersNew data={chartData} />
      {error && (
        <div className="text-sm text-red-600 mt-2">{error}</div>
      )}
    </ChartContainer>
  );
};

export default Chart;