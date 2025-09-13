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
      <span className="text-sm text-gray-600">Show bids</span>
      <button
        onClick={() => onToggleBids(!showBids)}
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
        <InfoIcon size={16} />
      </button>
    </div>
  );
};

export default ChartControls;