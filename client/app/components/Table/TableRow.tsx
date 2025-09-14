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
    <tr className={`${isEven ? 'bg-card' : 'bg-muted'} ${className}`}>
      {children}
    </tr>
  );
};

export default TableRow;