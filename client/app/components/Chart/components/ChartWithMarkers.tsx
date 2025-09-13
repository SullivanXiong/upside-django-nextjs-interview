import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { ChartData, chartOptions } from '../chartConfig';

interface ChartWithMarkersProps {
  data: ChartData;
  className?: string;
}

const ChartWithMarkers: React.FC<ChartWithMarkersProps> = ({ 
  data, 
  className = '' 
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  return (
    <div className={className}>
      {/* Chart Area */}
      <div className="h-48">
        <Line
          ref={chartRef}
          data={{
            labels: data.labels,
            datasets: data.datasets,
          }}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default ChartWithMarkers;