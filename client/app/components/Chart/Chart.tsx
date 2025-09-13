'use client';

import React, { useState, useMemo } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkersNew } from './components';
import { ChartData } from './chartConfig';
import { useApiData } from '@/lib/hooks/useApiData';
import { apiClient, ActivityTimelineData } from '@/lib/api';

interface ChartProps {
  className?: string;
  customerOrgId?: string;
  days?: number;
}

const Chart: React.FC<ChartProps> = ({ 
  className = '', 
  customerOrgId = 'org_4m6zyrass98vvtk3xh5kcwcmaf', // Default from sample data
  days = 30 
}) => {
  const [showBids, setShowBids] = useState(false);
  
  const { data: timelineData, loading, error, refetch } = useApiData<ActivityTimelineData>(
    () => apiClient.getActivityTimeline(customerOrgId, days),
    [customerOrgId, days]
  );

  const chartData: ChartData = useMemo(() => {
    if (!timelineData?.timeline) {
      return {
        labels: [],
        datasets: [{
          label: 'Activity Events',
          data: [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#3b82f6',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
        }],
        markers: [],
      };
    }

    // Sort timeline data by date
    const sortedTimeline = [...timelineData.timeline].sort((a, b) => 
      new Date(a.day).getTime() - new Date(b.day).getTime()
    );

    const labels = sortedTimeline.map(item => {
      const date = new Date(item.day);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    const data = sortedTimeline.map(item => item.count);

    // Generate markers based on data points
    const markers = sortedTimeline.map((item, index) => ({
      month: labels[index],
      label: `+${item.count}`,
      position: item.count,
    }));

    return {
      labels,
      datasets: [{
        label: 'Activity Events',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#3b82f6',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      }],
      markers,
    };
  }, [timelineData]);

  if (loading) {
    return (
      <ChartContainer className={className}>
        <ChartHeader 
          title="Activity Timeline"
          showBids={showBids}
          onToggleBids={setShowBids}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer className={className}>
        <ChartHeader 
          title="Activity Timeline"
          showBids={showBids}
          onToggleBids={setShowBids}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading chart data: {error}
            <button 
              onClick={refetch}
              className="ml-2 text-blue-500 hover:text-blue-700 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer className={className}>
      <ChartHeader 
        title="Activity Timeline"
        showBids={showBids}
        onToggleBids={setShowBids}
      />
      
      <ChartWithMarkersNew data={chartData} />
    </ChartContainer>
  );
};

export default Chart;