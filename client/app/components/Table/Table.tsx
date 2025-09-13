'use client';

import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableData from './TableData';
import TypeCell from './TypeCell';
import PeopleCell from './PeopleCell';
import ChannelCell from './ChannelCell';
import StatusCell from './StatusCell';
import TeamCell from './TeamCell';
import { 
  CalendarIcon, 
  ChartIcon, 
  PeopleIcon, 
  HashIcon, 
  StarIcon, 
  RefreshIcon
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
    color: 'purple' | 'gray' | 'yellow' | 'blue';
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
              <TableRow key={touchpoint.id} isEven={index % 2 === 0}>
                <TableData>
                  <TypeCell type={touchpoint.type} />
                </TableData>
                <TableData>
                  <span className="text-sm text-gray-900">{touchpoint.date}</span>
                </TableData>
                <TableData>
                  <span className="text-sm text-gray-900">{touchpoint.activity}</span>
                </TableData>
                <TableData>
                  <PeopleCell 
                    name={touchpoint.people} 
                    additionalCount={touchpoint.additionalPeople} 
                  />
                </TableData>
                <TableData>
                  <ChannelCell 
                    name={touchpoint.channel.name} 
                    color={touchpoint.channel.color} 
                  />
                </TableData>
                <TableData>
                  <StatusCell 
                    text={touchpoint.status.text} 
                    icon={touchpoint.status.icon} 
                  />
                </TableData>
                <TableData>
                  <TeamCell 
                    labels={touchpoint.team.labels} 
                    colors={touchpoint.team.colors} 
                  />
                </TableData>
              </TableRow>
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
