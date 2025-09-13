import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { ChartData, chartOptions } from '../chartConfig';
import MarkersRow from './MarkersRow';
import DateLabelsRow from './DateLabelsRow';

interface ChartWithMarkersNewProps {
  data: ChartData;
  className?: string;
}

const ChartWithMarkersNew: React.FC<ChartWithMarkersNewProps> = ({ 
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
      
      {/* Markers Row - Clean gap between chart and markers */}
      <div className="py-1">
        <MarkersRow data={data} />
      </div>
      
      {/* Date Labels Row - Clean gap between markers and dates */}
      <div className="py-1">
        <DateLabelsRow data={data} />
      </div>
    </div>
  );
};

export default ChartWithMarkersNew;