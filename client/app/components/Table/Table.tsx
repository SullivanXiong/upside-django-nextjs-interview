'use client';

import React, { useEffect, useMemo, useState } from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableData from './TableData';
import TypeCell from './TypeCell';
import PeopleCell from './PeopleCell';
import ChannelCell from './ChannelCell';
import StatusCell from './StatusCell';
import TeamCell from './TeamCell';
import { fetchJson, getDefaultIdentifiers } from '@/lib/api';
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
  const [touchpoints, setTouchpoints] = useState<TouchpointData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const channelColorMap = useMemo(() => ({
    Meeting: 'purple',
    Default: 'gray',
    Chatbot: 'yellow',
    'Direct Email': 'blue',
  } as Record<string, 'purple' | 'gray' | 'yellow' | 'blue'>), []);

  const statusIconMap = useMemo(() => ({
    Conversation: 'conversation',
    'Booked a meeting': 'booked',
    'Chatted with bot': 'chatted',
    Replied: 'replied',
    Sent: 'sent',
  } as Record<string, 'conversation' | 'booked' | 'chatted' | 'replied' | 'sent'>), []);

  useEffect(() => {
    const { customerOrgId, accountId } = getDefaultIdentifiers();
    const params = new URLSearchParams({
      customer_org_id: customerOrgId,
      account_id: accountId,
    });

    setIsLoading(true);
    setError(null);
    fetchJson<any[]>(`/api/events/random/?${params.toString()}`)
      .then((events) => {
        const mapped: TouchpointData[] = events.map((e) => {
          const primaryPerson = Array.isArray(e.people) && e.people.length > 0 ? e.people[0] : null;
          const fullName = primaryPerson ? `${primaryPerson.first_name || ''} ${primaryPerson.last_name || ''}`.trim() : 'Unknown';
          const additionalCount = Array.isArray(e.people) && e.people.length > 1 ? e.people.length - 1 : undefined;
          const date = e.timestamp ? new Date(e.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '';

          const channelName: string = e.channel || 'Default';
          const channelColor = channelColorMap[channelName] || 'gray';

          const statusText: string = e.status || 'Conversation';
          const statusIcon = statusIconMap[statusText] || 'conversation';

          const teamIds: string[] = Array.isArray(e.involved_team_ids) ? e.involved_team_ids : [];
          const teamLabels = teamIds.length > 0 ? teamIds.map((t) => String(t).toUpperCase()) : ['UNKNOWN'];
          const colorPalette = ['gray', 'red', 'blue', 'green'] as const;
          const teamColors = teamLabels.map((_, idx) => colorPalette[idx % colorPalette.length]);

          return {
            id: Number(e.id) || Math.floor(Math.random() * 1_000_000),
            type: (e.direction || '').toLowerCase() === 'in' ? 'incoming' : 'outgoing',
            date,
            activity: e.activity || '',
            people: fullName,
            additionalPeople: additionalCount,
            channel: { name: channelName, color: channelColor },
            status: { text: statusText, icon: statusIcon },
            team: { labels: teamLabels, colors: teamColors as unknown as string[] },
          } as TouchpointData;
        });
        setTouchpoints(mapped);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => setIsLoading(false));
  }, [channelColorMap, statusIconMap]);


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
            {isLoading && (
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500" colSpan={7}>Loading...</td>
              </tr>
            )}
            {error && !isLoading && (
              <tr>
                <td className="px-6 py-4 text-sm text-red-600" colSpan={7}>{error}</td>
              </tr>
            )}
            {!isLoading && !error && touchpoints.map((touchpoint, index) => (
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
