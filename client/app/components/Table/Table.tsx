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
import { fetchLatestEvents, EnrichedEvent } from '@/lib/api';
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

type TouchpointData = EnrichedEvent;

const Table: React.FC<TableProps> = ({ className = '' }) => {
  const [touchpoints, setTouchpoints] = useState<TouchpointData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const customerOrgId = useMemo(() => process.env.NEXT_PUBLIC_CUSTOMER_ORG_ID || 'org_4m6zyrass98vvtk3xh5kcwcmaf', []);
  const accountId = useMemo(() => process.env.NEXT_PUBLIC_ACCOUNT_ID || 'account_31crr1tcp2bmcv1fk6pcm0k6ag', []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchLatestEvents({ customerOrgId, accountId, limit: 5 });
      setTouchpoints(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerOrgId, accountId]);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-green-600">Touchpoints</h2>
          <span className="text-sm text-gray-500">[{touchpoints.length} shown]</span>
        </div>
        <button onClick={loadData} className="text-gray-400 hover:text-gray-600 p-2" aria-label="Refresh">
          <RefreshIcon size={20} />
        </button>
      </div>

      {isLoading && (
        <div className="p-6 text-sm text-gray-500">Loading latest events…</div>
      )}
      {error && (
        <div className="p-6 text-sm text-red-600">{error}</div>
      )}

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
