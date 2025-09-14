import React from 'react';
import { InfoIcon } from '../../Icons';

interface ChartControlsProps {
  showBids: boolean;
  onToggleBids: (show: boolean) => void;
  className?: string;
}

const ChartControls: React.FC<ChartControlsProps> = ({ 
  showBids, 
  onToggleBids, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm text-muted-foreground">Show bids</span>
      <button
        onClick={() => onToggleBids(!showBids)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          showBids ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${
            showBids ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <button className="text-muted-foreground hover:text-foreground">
        <InfoIcon size={16} />
      </button>
    </div>
  );
};

export default ChartControls;