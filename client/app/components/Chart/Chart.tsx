'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkers } from './components';
import { defaultChartData, ChartData } from './chartConfig';
import { useAllEventsForChart, useDashboardStats } from '@/lib/hooks';

interface ChartProps {
  className?: string;
  paginationRange?: {
    start: string | null;
    end: string | null;
  };
  onChartClick?: (date: string) => void;
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

// Helper function to group data by 3-month periods
const groupByQuarter = (dailyCounts: Array<{ date: string; count: number }>) => {
  const quarters: { [key: string]: { count: number; startDate: string; endDate: string } } = {};
  
  dailyCounts.forEach(item => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3);
    const quarterKey = `${year}-Q${quarter + 1}`;
    
    if (!quarters[quarterKey]) {
      const startMonth = quarter * 3;
      const endMonth = startMonth + 2;
      const startDate = new Date(year, startMonth, 1);
      const endDate = new Date(year, endMonth + 1, 0); // Last day of the quarter
      
      quarters[quarterKey] = {
        count: 0,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
    }
    
    quarters[quarterKey].count += item.count;
  });
  
  return Object.entries(quarters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({
      label: key,
      count: value.count,
      startDate: value.startDate,
      endDate: value.endDate
    }));
};

const Chart: React.FC<ChartProps> = ({ className = '', paginationRange, onChartClick }) => {
  const [showBids, setShowBids] = useState(false);
  // Initialize with sample data
  const [chartData, setChartData] = useState<ChartData>(generateSampleData());
  
  // Fetch ALL events data for chart
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useAllEventsForChart();
  const { data: statsData, loading: statsLoading, error: statsError } = useDashboardStats();

  // Process the events data for chart display
  const processedChartData = useMemo(() => {
    if (!eventsData || !eventsData.daily_counts || eventsData.daily_counts.length === 0) {
      return null;
    }

    // Group by quarters (3-month periods)
    const quarterlyData = groupByQuarter(eventsData.daily_counts);
    
    // Create labels and data arrays
    const labels = quarterlyData.map(q => {
      const [year, quarter] = q.label.split('-Q');
      const quarterNames = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
      return `${quarterNames[parseInt(quarter) - 1]} ${year}`;
    });
    
    const data = quarterlyData.map(q => q.count);
    
    return {
      labels,
      datasets: [
        {
          label: 'Activity Events (3-month totals)',
          data,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          pointBackgroundColor: 'rgb(34, 197, 94)',
          pointBorderColor: 'rgb(34, 197, 94)',
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.3,
          fill: true,
        }
      ],
      markers: [],
      // Store the original quarterly data for click handling
      quarterlyData
    };
  }, [eventsData]);

  useEffect(() => {
    if (processedChartData) {
      console.log('Setting processed chart data:', processedChartData);
      setChartData(processedChartData);
    }
  }, [processedChartData]);

  const isLoading = eventsLoading || statsLoading;
  const hasError = eventsError || statsError;
  const subtitle = eventsData ? `${eventsData.total_count} total events grouped by quarter` : 
                   statsData ? `${statsData.total_events} total events` : 
                   'Sample data';
  
  // Handle chart click to navigate to specific date in table
  const handleChartClick = (index: number) => {
    if (processedChartData?.quarterlyData && onChartClick) {
      const quarter = processedChartData.quarterlyData[index];
      if (quarter) {
        // Pass the start date of the quarter to navigate to that page in the table
        onChartClick(quarter.startDate);
      }
    }
  };

  return (
    <ChartContainer className={className}>
      <ChartHeader 
        title="Activity Timeline"
        showBids={showBids}
        onToggleBids={setShowBids}
        subtitle={subtitle}
      />
      
      {/* Always show the chart with either real or sample data */}
      <ChartWithMarkers 
        data={chartData} 
        paginationRange={paginationRange}
        onPointClick={handleChartClick}
      />
      
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
