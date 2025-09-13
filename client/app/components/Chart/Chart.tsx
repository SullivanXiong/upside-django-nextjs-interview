'use client';

import React, { useState, useEffect } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkersNew } from './components';
import { ChartData } from './chartConfig';
import { fetchChartData } from '@/lib/api';

interface ChartProps {
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [showBids, setShowBids] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchChartData();
        setChartData(data);
      } catch (err) {
        setError('Failed to load chart data');
        console.error('Error loading chart data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, []);

  if (isLoading) {
    return (
      <ChartContainer className={className}>
        <ChartHeader 
          title="Navigation Minimap"
          showBids={showBids}
          onToggleBids={setShowBids}
        />
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">Loading chart data...</span>
        </div>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer className={className}>
        <ChartHeader 
          title="Navigation Minimap"
          showBids={showBids}
          onToggleBids={setShowBids}
        />
        <div className="flex justify-center items-center h-64">
          <span className="text-red-500">{error}</span>
        </div>
      </ChartContainer>
    );
  }

  if (!chartData) {
    return (
      <ChartContainer className={className}>
        <ChartHeader 
          title="Navigation Minimap"
          showBids={showBids}
          onToggleBids={setShowBids}
        />
        <div className="flex justify-center items-center h-64">
          <span className="text-gray-500">No chart data available</span>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer className={className}>
      <ChartHeader 
        title="Navigation Minimap"
        showBids={showBids}
        onToggleBids={setShowBids}
      />
      
      <ChartWithMarkersNew data={chartData} />
    </ChartContainer>
  );
};

export default Chart;