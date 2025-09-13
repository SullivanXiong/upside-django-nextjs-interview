'use client';

import React, { useState } from 'react';
import { ChartContainer, ChartHeader, ChartWithMarkersNew } from './components';
import { defaultChartData, ChartData } from './chartConfig';

interface ChartProps {
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [showBids, setShowBids] = useState(false);
  const [chartData] = useState<ChartData>(defaultChartData);

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