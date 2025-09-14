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
    <div className={`bg-card text-card-foreground rounded-lg border border-border p-6 ${className}`}>
      {children}
    </div>
  );
};

export default ChartContainer;