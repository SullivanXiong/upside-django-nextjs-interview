'use client';

import React, { useState, useEffect } from 'react';
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
import { useActivityEvents, usePeople, useDashboardStats } from '@/lib/hooks';
import { ActivityEvent, Person } from '@/lib/api/types';

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
  const [touchpoints, setTouchpoints] = useState<TouchpointData[]>([]);
  
  // Fetch real data from API
  const { data: eventsData, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useActivityEvents();
  const { data: peopleData, loading: peopleLoading, error: peopleError } = usePeople();
  const { data: statsData } = useDashboardStats();
  
  // Transform API data to table format
  useEffect(() => {
    if (eventsData && peopleData) {
      const transformedData: TouchpointData[] = eventsData.map((event, index) => {
        // Find a person to associate with this event (randomly for demo)
        const person = peopleData[index % peopleData.length] || peopleData[0];
        
        // Map channel to color
        const channelColorMap: Record<string, 'purple' | 'gray' | 'yellow' | 'blue'> = {
          'email': 'blue',
          'chat': 'yellow',
          'meeting': 'purple',
          'default': 'gray'
        };
        
        // Map status to icon
        const statusIconMap: Record<string, 'conversation' | 'booked' | 'chatted' | 'replied' | 'sent'> = {
          'sent': 'sent',
          'replied': 'replied',
          'booked': 'booked',
          'chatted': 'chatted',
          'conversation': 'conversation'
        };
        
        // Determine type based on status
        const type = event.status?.toLowerCase().includes('incoming') ? 'incoming' : 'outgoing';
        
        return {
          id: event.id,
          type: type,
          date: new Date(event.timestamp).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          activity: event.activity,
          people: person ? `${person.first_name} ${person.last_name}` : 'Unknown',
          additionalPeople: Math.floor(Math.random() * 3),
          channel: {
            name: event.channel || 'Default',
            color: channelColorMap[event.channel?.toLowerCase()] || 'gray'
          },
          status: {
            text: event.status || 'Unknown',
            icon: statusIconMap[event.status?.toLowerCase()] || 'conversation'
          },
          team: {
            labels: ['UNKNOWN'],
            colors: ['gray']
          }
        };
      });
      
      setTouchpoints(transformedData);
    }
  }, [eventsData, peopleData]);
  
  const isLoading = eventsLoading || peopleLoading;
  const hasError = eventsError || peopleError;
  const totalCount = statsData?.total_events || touchpoints.length;
  
  const handleRefresh = () => {
    refetchEvents();
  };
  
  // Sample data as fallback
  const sampleTouchpoints: TouchpointData[] = [
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
  
  // Use sample data if no real data is available
  const displayData = touchpoints.length > 0 ? touchpoints : sampleTouchpoints;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-green-600">Touchpoints</h2>
          <span className="text-sm text-gray-500">[{totalCount} total]</span>
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600 p-2 transition-colors"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshIcon size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading touchpoints...</div>
        </div>
      )}
      
      {/* Error State */}
      {hasError && !isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">Error loading touchpoints. Please try again.</div>
        </div>
      )}
      
      {/* Table */}
      {!isLoading && !hasError && (
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
            {displayData.map((touchpoint, index) => (
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
      )}

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
