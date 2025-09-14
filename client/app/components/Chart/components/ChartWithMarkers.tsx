import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { ChartData, chartOptions } from '../chartConfig';
import MarkersRow from './MarkersRow';
import DateLabelsRow from './DateLabelsRow';

interface ChartWithMarkersProps {
  data: ChartData;
  className?: string;
}

const ChartWithMarkers: React.FC<ChartWithMarkersProps> = ({ 
  data, 
  className = '' 
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Ensure we have valid data
  if (!data.labels || data.labels.length === 0 || !data.datasets || data.datasets.length === 0) {
    console.warn('Invalid chart data structure');
    return (
      <div className={`${className} flex items-center justify-center h-44 bg-gray-50 rounded-lg`}>
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Chart Area */}
      <div className="h-44">
        <Line
          ref={chartRef}
          data={{
            labels: data.labels,
            datasets: data.datasets,
          }}
          options={chartOptions}
        />
      </div>
      
      {/* Markers Row - Minimal gap between chart and markers */}
      <div className="pt-4 pb-0">
        <MarkersRow data={data} />
      </div>
      
      {/* Date Labels Row - Clean gap between markers and dates */}
      <div className="py-0">
        <DateLabelsRow data={data} />
      </div>
    </div>
  );
};

export default ChartWithMarkers;
