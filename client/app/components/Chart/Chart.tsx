'use client';

import React, { useState, useEffect } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkersNew } from './components';
import { defaultChartData, ChartData } from './chartConfig';
import { useActivityTimeline, useDashboardStats } from '@/lib/hooks';

interface ChartProps {
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [showBids, setShowBids] = useState(false);
  const [chartData, setChartData] = useState<ChartData>(defaultChartData);
  
  // Fetch real data from API
  const { data: timelineData, loading: timelineLoading, error: timelineError } = useActivityTimeline();
  const { data: statsData, loading: statsLoading, error: statsError } = useDashboardStats();

  useEffect(() => {
    if (timelineData && timelineData.timeline) {
      // Transform API data to chart format
      const transformedData: ChartData = {
        labels: timelineData.timeline.map(item => {
          const date = new Date(item.day);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Activity Events',
            data: timelineData.timeline.map(item => item.count),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
          }
        ]
      };
      setChartData(transformedData);
    }
  }, [timelineData]);

  const isLoading = timelineLoading || statsLoading;
  const hasError = timelineError || statsError;

  return (
    <ChartContainer className={className}>
      <ChartHeader 
        title="Activity Timeline"
        showBids={showBids}
        onToggleBids={setShowBids}
        subtitle={statsData ? `${statsData.total_events} total events` : undefined}
      />
      
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      )}
      
      {hasError && (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading chart data</div>
        </div>
      )}
      
      {!isLoading && !hasError && (
        <ChartWithMarkersNew data={chartData} />
      )}
    </ChartContainer>
  );
};

export default Chart;