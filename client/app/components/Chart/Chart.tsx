'use client';

import React, { useState, useEffect } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkers } from './components';
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
    if (timelineData && timelineData.timeline && timelineData.timeline.length > 0) {
      // Transform API data to chart format
      const labels = timelineData.timeline.map(item => {
        const date = new Date(item.day);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      const data = timelineData.timeline.map(item => item.count);
      
      // Generate markers for significant data points
      const markers = timelineData.timeline
        .filter((item, index) => {
          // Show markers for every 3rd data point or significant changes
          return index % 3 === 0 || (index > 0 && Math.abs(item.count - timelineData.timeline[index - 1].count) > 5);
        })
        .map((item, index) => {
          const date = new Date(item.day);
          const label = item.count > 10 ? `+${item.count}` : item.count.toString();
          return {
            month: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            label: label,
            position: item.count
          };
        });
      
      const transformedData: ChartData = {
        labels,
        datasets: [
          {
            label: 'Activity Events',
            data,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointBorderColor: 'rgb(34, 197, 94)',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
          }
        ],
        markers: markers.length > 0 ? markers : []
      };
      setChartData(transformedData);
    } else if (!timelineLoading && !timelineData) {
      // If no data is available, keep using default chart data
      console.log('No timeline data available, using default chart data');
    }
  }, [timelineData, timelineLoading]);

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
        <ChartWithMarkers data={chartData} />
      )}
    </ChartContainer>
  );
};

export default Chart;
