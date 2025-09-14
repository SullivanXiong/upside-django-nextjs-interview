import React from 'react';
import { FilterIcon } from '../Icons';

interface TableHeaderProps {
  icon: React.ReactNode;
  label: string;
  onFilter?: () => void;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ 
  icon, 
  label, 
  onFilter, 
  className = '' 
}) => {
  return (
    <th className={`px-6 py-3 text-left ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="text-muted-foreground">
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        <button 
          onClick={onFilter}
          className="text-muted-foreground hover:text-foreground"
        >
          <FilterIcon />
        </button>
      </div>
    </th>
  );
};

export default TableHeader;