import React from 'react';
import { ChartData } from '../chartConfig';

interface MarkersRowProps {
  data: ChartData;
  className?: string;
}

const MarkersRow: React.FC<MarkersRowProps> = ({ 
  data, 
  className = '' 
}) => {
  return (
    <div className={`flex justify-between items-center py-1 ${className}`}>
      {data.markers.map((marker, index) => {
        const dataIndex = data.labels.indexOf(marker.month);
        if (dataIndex === -1) return null;

        return (
          <div
            key={index}
            className="flex items-center justify-center"
            style={{
              flex: 1,
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
  );
};

export default MarkersRow;