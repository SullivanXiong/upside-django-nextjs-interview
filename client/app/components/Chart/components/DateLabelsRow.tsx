import React from 'react';
import { ChartData } from '../chartConfig';

interface DateLabelsRowProps {
  data: ChartData;
  className?: string;
}

const DateLabelsRow: React.FC<DateLabelsRowProps> = ({ 
  data, 
  className = '' 
}) => {
  return (
    <div className={`flex justify-between items-center py-2 ${className}`}>
      {data.labels.map((label, index) => (
        <div
          key={index}
          className="flex items-center justify-center"
          style={{
            flex: 1,
          }}
        >
          <span className="text-xs text-gray-600">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DateLabelsRow;