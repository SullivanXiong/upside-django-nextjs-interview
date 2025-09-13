import React from 'react';

interface TableRowProps {
  children: React.ReactNode;
  isEven?: boolean;
  className?: string;
}

const TableRow: React.FC<TableRowProps> = ({ 
  children, 
  isEven = false, 
  className = '' 
}) => {
  return (
    <tr className={`${isEven ? 'bg-white' : 'bg-gray-50'} ${className}`}>
      {children}
    </tr>
  );
};

export default TableRow;