'use client';

import React, { useState } from 'react';

interface ChartProps {
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [showBids, setShowBids] = useState(false);

  // Sample data for the chart
  const chartData = [
    { month: 'Apr 2022', value: 20 },
    { month: 'Jul 2022', value: 35 },
    { month: 'Oct 2022', value: 25 },
    { month: 'Jan 2023', value: 45 },
    { month: 'Apr 2023', value: 30 },
    { month: 'Jul 2023', value: 55 },
    { month: 'Oct 2023', value: 40 },
    { month: 'Jan 2024', value: 60 },
    { month: 'Apr 2024', value: 35 },
    { month: 'Jul 2024', value: 50 },
    { month: 'Oct 2024', value: 45 },
    { month: 'Jan 2025', value: 70 },
  ];

  const markers = [
    { month: 'Apr 2022', label: 'SF', position: 20 },
    { month: 'Jul 2022', label: 'DA', position: 35 },
    { month: 'Oct 2022', label: 'CJ', position: 25 },
    { month: 'Jan 2023', label: '+2', position: 45 },
    { month: 'Apr 2023', label: '+4', position: 30 },
    { month: 'Jul 2023', label: '+1', position: 55 },
    { month: 'Oct 2023', label: '+3', position: 40 },
    { month: 'Jan 2024', label: '+2', position: 60 },
    { month: 'Apr 2024', label: '+1', position: 35 },
    { month: 'Jul 2024', label: '+5', position: 50 },
    { month: 'Oct 2024', label: '+2', position: 45 },
    { month: 'Jan 2025', label: '+3', position: 70 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const range = maxValue - minValue;

  // Calculate SVG path for the line
  const width = 800;
  const height = 200;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const getX = (index: number) => padding + (index * chartWidth) / (chartData.length - 1);
  const getY = (value: number) => padding + chartHeight - ((value - minValue) / range) * chartHeight;

  const pathData = chartData
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.value)}`)
    .join(' ');

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-green-600">Navigation Minimap</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">Show bids</span>
          <button
            onClick={() => setShowBids(!showBids)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showBids ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showBids ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <svg width={width} height={height} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value, index) => {
            const y = getY(minValue + (value / 100) * range);
            return (
              <line
                key={index}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            );
          })}

          {/* Chart line */}
          <path
            d={pathData}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            className="drop-shadow-sm"
          />

          {/* Data points */}
          {chartData.map((point, index) => (
            <circle
              key={index}
              cx={getX(index)}
              cy={getY(point.value)}
              r="4"
              fill="#3b82f6"
              className="drop-shadow-sm"
            />
          ))}

          {/* Markers */}
          {markers.map((marker, index) => {
            const pointIndex = chartData.findIndex(d => d.month === marker.month);
            if (pointIndex === -1) return null;
            
            return (
              <g key={index}>
                <circle
                  cx={getX(pointIndex)}
                  cy={getY(marker.position)}
                  r="8"
                  fill="white"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <text
                  x={getX(pointIndex)}
                  y={getY(marker.position)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-blue-600"
                >
                  {marker.label}
                </text>
              </g>
            );
          })}

          {/* Selection overlay (highlighted area) */}
          <rect
            x={getX(6)} // Oct 2023
            y={padding}
            width={getX(8) - getX(6)} // Dec 2023
            height={chartHeight}
            fill="#3b82f6"
            fillOpacity="0.1"
            stroke="#3b82f6"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* X-axis labels */}
          {chartData.map((point, index) => (
            <text
              key={index}
              x={getX(index)}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {point.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Chart;