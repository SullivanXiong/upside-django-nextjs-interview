import React from 'react';

interface PeopleCellProps {
  name: string;
  additionalCount?: number;
  className?: string;
}

const PeopleCell: React.FC<PeopleCellProps> = ({ 
  name, 
  additionalCount, 
  className = '' 
}) => {
  return (
    <div className={`text-sm text-gray-900 ${className}`}>
      <div className="flex items-center space-x-1">
        <span>{name}</span>
        {additionalCount && additionalCount > 0 && (
          <span className="text-blue-500 text-xs">+{additionalCount}</span>
        )}
      </div>
    </div>
  );
};

export default PeopleCell;