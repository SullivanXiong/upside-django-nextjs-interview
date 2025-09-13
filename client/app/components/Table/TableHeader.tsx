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
        <div className="text-gray-400">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button 
          onClick={onFilter}
          className="text-gray-400 hover:text-gray-600"
        >
          <FilterIcon />
        </button>
      </div>
    </th>
  );
};

export default TableHeader;