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
  onPointClick?: (index: number) => void;
}

const ChartWithMarkers: React.FC<ChartWithMarkersProps> = ({ 
  data, 
  className = '',
  paginationRange,
  onPointClick
}) => {
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Create chart options with click handler
  const chartOptions = useMemo(() => {
    const options = createChartOptions();
    
    // Add click handler to the chart
    if (onPointClick) {
      (options as any).onClick = (event: any, elements: any[]) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          onPointClick(index);
        }
      };
      
      // Make cursor pointer on hover over data points
      (options as any).onHover = (event: any, elements: any[]) => {
        const canvas = chartRef.current?.canvas;
        if (canvas) {
          canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      };
    }
    
    return options;
  }, [onPointClick]);
  
  // Ensure we have valid data
  if (!data.labels || data.labels.length === 0 || !data.datasets || data.datasets.length === 0) {
    console.warn('Invalid chart data structure');
    return (
      <div className={`${className} flex items-center justify-center h-44 bg-muted rounded-lg`}>
        <p className="text-muted-foreground">No chart data available</p>
      </div>
    );
  }

  // Calculate positions for pagination range indicators
  const rangeIndicators = useMemo(() => {
    if (!paginationRange || !data.labels || data.labels.length === 0) {
      return null;
    }

    console.log('Pagination range:', paginationRange);
    console.log('Chart labels sample:', data.labels.slice(0, 5));

    // Find the indices for start and end dates
    let startIndex = -1;
    let endIndex = -1;

    if (paginationRange.start) {
      // Parse the ISO date string properly
      const startDate = new Date(paginationRange.start);
      const startDateStr = startDate.toISOString().split('T')[0];
      
      // Find the first label that matches or is after the start date
      startIndex = data.labels.findIndex(label => {
        const labelDateStr = label.includes('T') ? label.split('T')[0] : label;
        return labelDateStr >= startDateStr;
      });
    }
    
    if (paginationRange.end) {
      // Parse the ISO date string properly
      const endDate = new Date(paginationRange.end);
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Find the first label that is after the end date
      endIndex = data.labels.findIndex(label => {
        const labelDateStr = label.includes('T') ? label.split('T')[0] : label;
        return labelDateStr > endDateStr;
      });
      
      // If no date is after the end date, use the last index
      if (endIndex === -1 && data.labels.length > 0) {
        const lastLabelStr = data.labels[data.labels.length - 1];
        const lastDateStr = lastLabelStr.includes('T') ? lastLabelStr.split('T')[0] : lastLabelStr;
        if (lastDateStr <= endDateStr) {
          endIndex = data.labels.length - 1;
        }
      }
    }

    console.log('Start index:', startIndex, 'End index:', endIndex);

    if (startIndex === -1 && endIndex === -1) return null;

    const totalLabels = data.labels.length;
    const startPosition = startIndex >= 0 ? (startIndex / (totalLabels - 1)) * 100 : null;
    const endPosition = endIndex >= 0 ? (endIndex / (totalLabels - 1)) * 100 : null;

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
                className="absolute top-0 bottom-0 w-0.5 bg-destructive opacity-60"
                style={{ left: `${rangeIndicators.startPosition}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                  Page Start
                </div>
              </div>
            )}
            {rangeIndicators.endPosition !== null && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-destructive opacity-60"
                style={{ left: `${rangeIndicators.endPosition}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                  Page End
                </div>
              </div>
            )}
            {/* Highlight the range between start and end */}
            {rangeIndicators.startPosition !== null && rangeIndicators.endPosition !== null && (
              <div
                className="absolute top-0 bottom-0 bg-destructive opacity-10"
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
