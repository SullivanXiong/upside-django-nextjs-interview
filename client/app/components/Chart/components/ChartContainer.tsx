import React from 'react';

interface ChartContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default ChartContainer;