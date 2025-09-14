import React from 'react';
import ChartControls from './ChartControls';

interface ChartHeaderProps {
  title: string;
  subtitle?: string;
  showBids: boolean;
  onToggleBids: (show: boolean) => void;
  className?: string;
}

const ChartHeader: React.FC<ChartHeaderProps> = ({ 
  title, 
  subtitle,
  showBids, 
  onToggleBids, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <span className="text-sm text-muted-foreground">[{subtitle}]</span>
        )}
      </div>
      <ChartControls 
        showBids={showBids} 
        onToggleBids={onToggleBids} 
      />
    </div>
  );
};

export default ChartHeader;