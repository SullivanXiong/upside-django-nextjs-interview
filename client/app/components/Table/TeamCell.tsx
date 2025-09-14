import React from 'react';

interface TeamCellProps {
  labels: string[];
  colors: string[];
  className?: string;
}

const TeamCell: React.FC<TeamCellProps> = ({ 
  labels, 
  colors, 
  className = '' 
}) => {
  const getTeamColor = (color: string) => {
    const colorMap = {
      gray: 'bg-muted text-foreground',
      red: 'bg-destructive text-destructive-foreground',
      blue: 'bg-primary text-primary-foreground',
      green: 'bg-secondary text-secondary-foreground'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-200 text-gray-700';
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {labels.map((label, index) => (
        <span
          key={index}
          className={`px-2 py-1 text-xs font-medium rounded-full ${getTeamColor(colors[index])}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
};

export default TeamCell;