import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // Add markers as custom elements
    const markers = data.markers.map((marker) => {
      const dataIndex = data.labels.indexOf(marker.month);
      if (dataIndex === -1) return null;

      const point = chart.getDatasetMeta(0).data[dataIndex];
      
      if (!point) return null;

      return {
        type: 'point',
        x: point.x,
        y: point.y,
        radius: 8,
        backgroundColor: 'white',
        borderColor: '#3b82f6',
        borderWidth: 2,
        label: marker.label,
      };
    }).filter(Boolean);

    // Store markers for potential future use
    (chart as unknown as { markers: unknown }).markers = markers;
  }, [data]);

  return (
    <div className={`relative ${className}`}>
      <Line
        ref={chartRef}
        data={{
          labels: data.labels,
          datasets: data.datasets,
        }}
        options={chartOptions}
      />
      
      {/* Custom markers overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {data.markers.map((marker, index) => {
          const dataIndex = data.labels.indexOf(marker.month);
          if (dataIndex === -1) return null;

          // Calculate position based on chart dimensions
          const xPercent = (dataIndex / (data.labels.length - 1)) * 100;
          const yPercent = 50; // Approximate middle for now

          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
              }}
            >
              <div className="w-4 h-4 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-blue-600">
                  {marker.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartWithMarkers;