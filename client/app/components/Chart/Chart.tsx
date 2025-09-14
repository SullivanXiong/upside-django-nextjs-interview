'use client';

import React, { useState, useEffect } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkers } from './components';
import { defaultChartData, ChartData } from './chartConfig';
import { useActivityTimeline, useDashboardStats } from '@/lib/hooks';

interface ChartProps {
  className?: string;
}

// Generate sample data function
const generateSampleData = (): ChartData => {
  const labels = [];
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    data.push(Math.floor(Math.random() * 50) + 10);
  }
  
  return {
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
    markers: []
  };
};

const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [showBids, setShowBids] = useState(false);
  // Initialize with sample data
  const [chartData, setChartData] = useState<ChartData>(generateSampleData());
  
  // Fetch real data from API
  const { data: timelineData, loading: timelineLoading, error: timelineError } = useActivityTimeline();
  const { data: statsData, loading: statsLoading, error: statsError } = useDashboardStats();

  useEffect(() => {
    // Only update if we have real data from API
    if (timelineData && timelineData.timeline && timelineData.timeline.length > 0) {
      console.log('Using API timeline data:', timelineData.timeline);
      
      // Transform API data to chart format
      const labels = timelineData.timeline.map(item => {
        const date = new Date(item.day);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      const data = timelineData.timeline.map(item => item.count);
      
      const transformedData: ChartData = {
        labels,
        datasets: [
          {
            label: 'Activity Events (Live Data)',
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
        markers: []
      };
      
      console.log('Setting chart data from API:', transformedData);
      setChartData(transformedData);
    } else {
      console.log('Using sample data - API returned:', timelineData);
    }
  }, [timelineData]);

  const isLoading = timelineLoading || statsLoading;
  const hasError = timelineError || statsError;
  const subtitle = statsData ? `${statsData.total_events} total events` : 
                   timelineData ? `${timelineData.timeline?.length || 0} data points` : 
                   'Sample data';

  return (
    <ChartContainer className={className}>
      <ChartHeader 
        title="Activity Timeline"
        showBids={showBids}
        onToggleBids={setShowBids}
        subtitle={subtitle}
      />
      
      {/* Always show the chart with either real or sample data */}
      <ChartWithMarkers data={chartData} />
      
      {/* Show loading/error indicators as overlays if needed */}
      {isLoading && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Loading live data...
        </div>
      )}
      
      {hasError && !isLoading && (
        <div className="text-center text-sm text-orange-500 mt-2">
          Using sample data (API unavailable)
        </div>
      )}
    </ChartContainer>
  );
};

export default Chart;
