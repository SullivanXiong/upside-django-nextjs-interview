import React from 'react';

interface ChannelCellProps {
  name: string;
  color: 'purple' | 'gray' | 'yellow' | 'blue';
  className?: string;
}

const ChannelCell: React.FC<ChannelCellProps> = ({ 
  name, 
  color, 
  className = '' 
}) => {
  const getChannelColor = (color: string) => {
    const colors = {
      purple: 'bg-purple-500',
      gray: 'bg-gray-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getChannelColor(color)}`}></div>
      <span className="text-sm text-gray-900">{name}</span>
    </div>
  );
};

export default ChannelCell;