import React, { useRef, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';
import { ChartData, createChartOptions } from '../chartConfig';
import MarkersRow from './MarkersRow';
import DateLabelsRow from './DateLabelsRow';

interface ChartWithMarkersProps {
  data: ChartData;
  className?: string;
  paginationRange?: {
    start: string | null;
    end: string | null;
  };
}

const ChartWithMarkers: React.FC<ChartWithMarkersProps> = ({ 
  data, 
  className = '',
  paginationRange
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Create chart options with pagination range indicators
  const chartOptions = useMemo(() => {
    return createChartOptions();
  }, []);
  
  // Ensure we have valid data
  if (!data.labels || data.labels.length === 0 || !data.datasets || data.datasets.length === 0) {
    console.warn('Invalid chart data structure');
    return (
      <div className={`${className} flex items-center justify-center h-44 bg-gray-50 rounded-lg`}>
        <p className="text-gray-500">No chart data available</p>
      </div>
    );
  }

  // Calculate positions for pagination range indicators
  const rangeIndicators = useMemo(() => {
    if (!paginationRange || !data.labels || data.labels.length === 0) {
      return null;
    }

    const startIndex = paginationRange.start 
      ? data.labels.findIndex(label => {
          // Parse dates and compare
          const labelDate = new Date(label).getTime();
          const startDate = new Date(paginationRange.start!).getTime();
          return labelDate >= startDate;
        })
      : -1;
    
    const endIndex = paginationRange.end
      ? data.labels.findIndex(label => {
          const labelDate = new Date(label).getTime();
          const endDate = new Date(paginationRange.end!).getTime();
          return labelDate >= endDate;
        })
      : -1;

    if (startIndex === -1 && endIndex === -1) return null;

    const totalLabels = data.labels.length;
    const startPosition = startIndex >= 0 ? (startIndex / totalLabels) * 100 : null;
    const endPosition = endIndex >= 0 ? (endIndex / totalLabels) * 100 : null;

    return { startPosition, endPosition };
  }, [data.labels, paginationRange]);

  return (
    <div className={className}>
      {/* Chart Area with range indicators */}
      <div className="relative h-44">
        <Line
          ref={chartRef}
          data={{
            labels: data.labels,
            datasets: data.datasets,
          }}
          options={chartOptions}
        />
        
        {/* Pagination Range Indicators */}
        {rangeIndicators && (
          <>
            {rangeIndicators.startPosition !== null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 opacity-60"
                style={{ left: `${rangeIndicators.startPosition}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Page Start
                </div>
              </div>
            )}
            {rangeIndicators.endPosition !== null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 opacity-60"
                style={{ left: `${rangeIndicators.endPosition}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Page End
                </div>
              </div>
            )}
            {/* Highlight the range between start and end */}
            {rangeIndicators.startPosition !== null && rangeIndicators.endPosition !== null && (
              <div
                className="absolute top-0 bottom-0 bg-red-500 opacity-10"
                style={{
                  left: `${rangeIndicators.startPosition}%`,
                  width: `${rangeIndicators.endPosition - rangeIndicators.startPosition}%`
                }}
              />
            )}
          </>
        )}
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
