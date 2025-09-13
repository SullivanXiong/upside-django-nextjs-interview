import React from 'react';
import { ArrowRightIcon, ArrowLeftIcon } from '../Icons';

interface TypeCellProps {
  type: 'outgoing' | 'incoming';
  className?: string;
}

const TypeCell: React.FC<TypeCellProps> = ({ type, className = '' }) => {
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ${className}`}>
      {type === 'outgoing' ? (
        <ArrowRightIcon className="w-4 h-4 text-blue-600" />
      ) : (
        <ArrowLeftIcon className="w-4 h-4 text-pink-600" />
      )}
    </div>
  );
};

export default TypeCell;