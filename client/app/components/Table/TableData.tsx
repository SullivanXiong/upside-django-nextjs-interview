import React from 'react';

interface TableDataProps {
  children: React.ReactNode;
  className?: string;
}

const TableData: React.FC<TableDataProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
};

export default TableData;