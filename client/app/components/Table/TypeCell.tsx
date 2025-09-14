import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from '../Icons';

interface TypeCellProps {
  type: 'outgoing' | 'incoming';
  className?: string;
}

const TypeCell: React.FC<TypeCellProps> = ({ type, className = '' }) => {
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${className}`}>
      {type === 'outgoing' ? (
        <ArrowRightIcon className="w-4 h-4 text-primary" />
      ) : (
        <ArrowLeftIcon className="w-4 h-4 text-destructive" />
      )}
    </div>
  );
};

export default TypeCell;