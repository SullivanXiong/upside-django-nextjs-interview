'use client';

import React, { useMemo } from 'react';
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
import { useApiData } from '@/lib/hooks/useApiData';
import { apiClient, ActivityEvent } from '@/lib/api';

interface TableProps {
  className?: string;
  customerOrgId?: string;
  accountId?: string;
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

const getChannelColor = (channel: string): 'purple' | 'gray' | 'yellow' | 'blue' => {
  const channelMap: { [key: string]: 'purple' | 'gray' | 'yellow' | 'blue' } = {
    'Meeting': 'purple',
    'Default': 'gray',
    'Chatbot': 'yellow',
    'Direct Email': 'blue',
    'Email': 'blue',
    'Phone': 'purple',
    'Chat': 'yellow',
    'Web': 'gray',
  };
  return channelMap[channel] || 'gray';
};

const getStatusIcon = (status: string): 'conversation' | 'booked' | 'chatted' | 'replied' | 'sent' => {
  const statusMap: { [key: string]: 'conversation' | 'booked' | 'chatted' | 'replied' | 'sent' } = {
    'Conversation': 'conversation',
    'Booked a meeting': 'booked',
    'Chatted with bot': 'chatted',
    'Replied': 'replied',
    'Sent': 'sent',
    'Completed': 'conversation',
    'Scheduled': 'booked',
    'In Progress': 'conversation',
  };
  return statusMap[status] || 'conversation';
};

const Table: React.FC<TableProps> = ({ 
  className = '', 
  customerOrgId = 'org_4m6zyrass98vvtk3xh5kcwcmaf',
  accountId = 'account_31crr1tcp2bmcv1fk6pcm0k6ag'
}) => {
  const { data: events, loading, error, refetch } = useApiData<ActivityEvent[]>(
    () => apiClient.getRandomActivityEvents(customerOrgId, accountId),
    [customerOrgId, accountId]
  );

  const touchpoints: TouchpointData[] = useMemo(() => {
    if (!events) return [];

    return events.map((event, index) => {
      const date = new Date(event.timestamp);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });

      // Extract people names from the people JSON field
      const peopleNames = Array.isArray(event.people) 
        ? event.people.map((person: any) => person.name || person.first_name || 'Unknown').join(', ')
        : 'Unknown';

      // Get team information from involved_team_ids
      const teamLabels = Array.isArray(event.involved_team_ids) 
        ? event.involved_team_ids.map((team: any) => team.name || team.id || 'UNKNOWN')
        : ['UNKNOWN'];

      const teamColors = teamLabels.map(() => 
        ['red', 'blue', 'green', 'yellow', 'purple', 'gray'][Math.floor(Math.random() * 6)]
      );

      return {
        id: event.id,
        type: event.direction === 'OUT' ? 'outgoing' : 'incoming',
        date: formattedDate,
        activity: event.activity || 'No activity description',
        people: peopleNames,
        additionalPeople: Math.max(0, (event.people?.length || 1) - 1),
        channel: { 
          name: event.channel || 'Unknown', 
          color: getChannelColor(event.channel || 'Unknown')
        },
        status: { 
          text: event.status || 'Unknown', 
          icon: getStatusIcon(event.status || 'Unknown')
        },
        team: { 
          labels: teamLabels, 
          colors: teamColors
        }
      };
    });
  }, [events]);


  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading touchpoints...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading touchpoints: {error}
            <button 
              onClick={refetch}
              className="ml-2 text-blue-500 hover:text-blue-700 underline"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-green-600">Touchpoints</h2>
          <span className="text-sm text-gray-500">[{touchpoints.length} total]</span>
        </div>
        <button 
          onClick={refetch}
          className="text-gray-400 hover:text-gray-600 p-2"
        >
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
