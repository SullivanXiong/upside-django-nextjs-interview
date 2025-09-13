'use client';

import React from 'react';
import TableHeader from './TableHeader';
import { 
  CalendarIcon, 
  ChartIcon, 
  PeopleIcon, 
  HashIcon, 
  StarIcon, 
  RefreshIcon,
  ConversationIcon,
  QuestionIcon,
  SendIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '../Icons';

interface TableProps {
  className?: string;
}

interface TouchpointData {
  id: number;
  type: 'outgoing' | 'incoming';
  date: string;
  activity: string;
  people: string;
  additionalPeople?: number;
  channel: {
    name: string;
    color: string;
  };
  status: {
    text: string;
    icon: 'conversation' | 'booked' | 'chatted' | 'replied' | 'sent';
  };
  team: {
    labels: string[];
    colors: string[];
  };
}

const Table: React.FC<TableProps> = ({ className = '' }) => {
  // Sample data matching the reference image
  const touchpoints: TouchpointData[] = [
    {
      id: 1,
      type: 'outgoing',
      date: 'Dec 1, 2023',
      activity: 'Building one plant late',
      people: 'Dorothy Atkinson',
      additionalPeople: 1,
      channel: { name: 'Meeting', color: 'purple' },
      status: { text: 'Conversation', icon: 'conversation' },
      team: { labels: ['UNKNOWN'], colors: ['gray'] }
    },
    {
      id: 2,
      type: 'outgoing',
      date: 'Dec 1, 2023',
      activity: 'Modern today six pretty hand the image',
      people: 'Dorothy Atkinson',
      additionalPeople: 2,
      channel: { name: 'Default', color: 'gray' },
      status: { text: 'Booked a meeting', icon: 'booked' },
      team: { labels: ['MARKETING'], colors: ['red'] }
    },
    {
      id: 3,
      type: 'incoming',
      date: 'Dec 1, 2023',
      activity: 'Local focus bill set fast current',
      people: 'Dorothy Atkinson',
      additionalPeople: 3,
      channel: { name: 'Chatbot', color: 'yellow' },
      status: { text: 'Chatted with bot', icon: 'chatted' },
      team: { labels: ['SALES', 'SDR'], colors: ['blue', 'green'] }
    },
    {
      id: 4,
      type: 'outgoing',
      date: 'Dec 1, 2023',
      activity: 'Real especially hundred recent natural',
      people: 'Dorothy Atkinson',
      channel: { name: 'Direct Email', color: 'blue' },
      status: { text: 'Replied', icon: 'replied' },
      team: { labels: ['UNKNOWN'], colors: ['gray'] }
    },
    {
      id: 5,
      type: 'outgoing',
      date: 'Dec 1, 2023',
      activity: 'Republican consumer feel',
      people: 'Dorothy Atkinson',
      channel: { name: 'Direct Email', color: 'blue' },
      status: { text: 'Sent', icon: 'sent' },
      team: { labels: ['MARKETING'], colors: ['red'] }
    }
  ];

  const getChannelColor = (color: string) => {
    const colors = {
      purple: 'bg-purple-500',
      gray: 'bg-gray-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const getTeamColor = (color: string) => {
    const colors = {
      gray: 'bg-gray-200 text-gray-700',
      red: 'bg-red-500 text-white',
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-200 text-green-800'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-200 text-gray-700';
  };

  const getStatusIcon = (icon: string) => {
    switch (icon) {
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
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-green-600">Touchpoints</h2>
          <span className="text-sm text-gray-500">[1506 total]</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-2">
          <RefreshIcon size={20} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button className="text-gray-400 hover:text-gray-600">
                  <HashIcon />
                </button>
              </th>
              <TableHeader 
                icon={<CalendarIcon />} 
                label="Date" 
                onFilter={() => console.log('Filter by Date')} 
              />
              <TableHeader 
                icon={<ChartIcon />} 
                label="Activity" 
                onFilter={() => console.log('Filter by Activity')} 
              />
              <TableHeader 
                icon={<PeopleIcon />} 
                label="People" 
                onFilter={() => console.log('Filter by People')} 
              />
              <TableHeader 
                icon={<HashIcon />} 
                label="# Channel" 
                onFilter={() => console.log('Filter by Channel')} 
              />
              <TableHeader 
                icon={<StarIcon />} 
                label="Status" 
                onFilter={() => console.log('Filter by Status')} 
              />
              <TableHeader 
                icon={<PeopleIcon />} 
                label="Team" 
                onFilter={() => console.log('Filter by Team')} 
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {touchpoints.map((touchpoint, index) => (
              <tr key={touchpoint.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    {touchpoint.type === 'outgoing' ? (
                      <ArrowRightIcon className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ArrowLeftIcon className="w-4 h-4 text-pink-600" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{touchpoint.date}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{touchpoint.activity}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <span>{touchpoint.people}</span>
                    {touchpoint.additionalPeople && (
                      <span className="text-blue-500 text-xs">+{touchpoint.additionalPeople}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getChannelColor(touchpoint.channel.color)}`}></div>
                    <span className="text-sm text-gray-900">{touchpoint.channel.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-gray-600">
                      {getStatusIcon(touchpoint.status.icon)}
                    </div>
                    <span className="text-sm text-gray-900">{touchpoint.status.text}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    {touchpoint.team.labels.map((label, labelIndex) => (
                      <span
                        key={labelIndex}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getTeamColor(touchpoint.team.colors[labelIndex])}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center py-4">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Table;
