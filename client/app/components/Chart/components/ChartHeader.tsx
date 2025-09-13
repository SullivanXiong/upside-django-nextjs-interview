import React from 'react';
import ChartControls from './ChartControls';

interface ChartHeaderProps {
  title: string;
  showBids: boolean;
  onToggleBids: (show: boolean) => void;
  className?: string;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ 
  title, 
  showBids, 
  onToggleBids, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <h2 className="text-xl font-semibold text-green-600">{title}</h2>
      <ChartControls 
        showBids={showBids} 
        onToggleBids={onToggleBids} 
      />
    </div>
  );
};

export default ChartHeader;