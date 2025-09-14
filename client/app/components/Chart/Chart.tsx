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
        borderColor: 'oklch(0.646 0.222 264.376)',
        backgroundColor: 'color-mix(in oklab, var(--chart-1) 20%, transparent)',
        pointBackgroundColor: 'oklch(0.646 0.222 264.376)',
        pointBorderColor: 'oklch(0.646 0.222 264.376)',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      }
    ],
    markers: []
  };
};

// Helper function to generate labels at 3-month intervals
const generateQuarterlyLabels = (dailyCounts: Array<{ date: string; count: number }>) => {
  if (dailyCounts.length === 0) return { labels: [], displayIndices: [] };
  
  const allDates = dailyCounts.map(item => item.date);
  const labels: string[] = [];
  const displayIndices: number[] = [];
  
  // Create labels for all dates but only display at 3-month intervals
  let lastQuarterShown = -1;
  
  allDates.forEach((dateStr, index) => {
    const date = new Date(dateStr);
    const quarter = Math.floor(date.getMonth() / 3);
    const year = date.getFullYear();
    const quarterKey = `${year}-Q${quarter}`;
    
    // Always add the label (for data point alignment)
    labels.push(dateStr);
    
    // Only mark for display at the start of each quarter
    if (quarter !== lastQuarterShown || index === 0 || index === allDates.length - 1) {
      const monthNames = ['Jan', 'Apr', 'Jul', 'Oct'];
      const displayLabel = `${monthNames[quarter * 1]} ${year}`;
      displayIndices.push(index);
      lastQuarterShown = quarter;
    }
  });
  
  return { labels, displayIndices };
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

    // Sort daily counts by date
    const sortedDailyCounts = [...eventsData.daily_counts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Fill in missing dates with 0 counts for continuous line
    const filledData: Array<{ date: string; count: number }> = [];
    if (sortedDailyCounts.length > 0) {
      const startDate = new Date(sortedDailyCounts[0].date);
      const endDate = new Date(sortedDailyCounts[sortedDailyCounts.length - 1].date);
      const dateMap = new Map(sortedDailyCounts.map(item => [item.date, item.count]));
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        filledData.push({
          date: dateStr,
          count: dateMap.get(dateStr) || 0
        });
      }
    }
    
    // Create labels for all dates (used for data alignment and tooltips)
    // We'll use the actual dates as labels so the chart can properly place points
    const labels = filledData.map(item => item.date);
    
    const data = filledData.map(item => item.count);
    
    return {
      labels,
      datasets: [
        {
          label: 'Daily Activity Events',
          data,
          borderColor: 'oklch(0.646 0.222 264.376)',
          backgroundColor: 'color-mix(in oklab, var(--chart-1) 20%, transparent)',
          pointBackgroundColor: 'oklch(0.646 0.222 264.376)',
          pointBorderColor: 'oklch(0.646 0.222 264.376)',
          pointRadius: 2,
          pointHoverRadius: 5,
          tension: 0.1,
          fill: true,
        }
      ],
      markers: [],
      // Store the daily data for click handling
      dailyData: filledData
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
  const subtitle = eventsData ? `${eventsData.total_count} total events over ${processedChartData?.dailyData?.length || 0} days` : 
                   statsData ? `${statsData.total_events} total events` : 
                   'Sample data';
  
  // Handle chart click to navigate to specific date in table
  const handleChartClick = (index: number) => {
    if (processedChartData?.dailyData && onChartClick) {
      const dayData = processedChartData.dailyData[index];
      if (dayData) {
        // Pass the clicked date to navigate to that page in the table
        console.log('Chart clicked - navigating to date:', dayData.date);
        onChartClick(dayData.date);
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
        <div className="text-center text-sm text-muted-foreground mt-2">
          Loading live data...
        </div>
      )}
      
      {hasError && !isLoading && (
        <div className="text-center text-sm text-destructive mt-2">
          Using sample data (API unavailable)
        </div>
      )}
    </ChartContainer>
  );
};

export default Chart;
