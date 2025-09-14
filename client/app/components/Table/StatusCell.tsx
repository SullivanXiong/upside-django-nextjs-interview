import React from 'react';
import { 
  ConversationIcon, 
  QuestionIcon, 
  SendIcon 
} from '../Icons';

interface StatusCellProps {
  text: string;
  icon: 'conversation' | 'booked' | 'chatted' | 'replied' | 'sent';
  className?: string;
}

const StatusCell: React.FC<StatusCellProps> = ({ 
  text, 
  icon, 
  className = '' 
}) => {
  const getStatusIcon = (iconType: string) => {
    switch (iconType) {
      case 'conversation':
        return <ConversationIcon className="w-4 h-4" />;
      case 'booked':
      case 'chatted':
      case 'replied':
        return <QuestionIcon className="w-4 h-4" />;
      case 'sent':
        return <SendIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="text-muted-foreground">
        {getStatusIcon(icon)}
      </div>
      <span className="text-sm text-foreground">{text}</span>
    </div>
  );
};

export default StatusCell;