'use client';

import React, { useEffect, useState } from 'react';
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
import { fetchTouchpoints, TouchpointData } from '@/lib/api';

interface TableProps {
  className?: string;
}

const Table: React.FC<TableProps> = ({ className = '' }) => {
  const [touchpoints, setTouchpoints] = useState<TouchpointData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTouchpoints = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchTouchpoints(currentPage, 10);
      setTouchpoints(response.touchpoints);
      setTotalCount(response.total);
    } catch (err) {
      setError('Failed to load touchpoints');
      console.error('Error loading touchpoints:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTouchpoints();
  }, [currentPage]);

  const handleRefresh = () => {
    loadTouchpoints();
  };

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

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
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
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center space-x-2">
                    <RefreshIcon size={20} className="animate-spin text-gray-400" />
                    <span className="text-gray-500">Loading touchpoints...</span>
                  </div>
                </td>
              </tr>
            ) : touchpoints.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No touchpoints found
                </td>
              </tr>
            ) : (
              touchpoints.map((touchpoint, index) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination / Scroll indicator */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage}
          </span>
          <button 
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={touchpoints.length < 10 || isLoading}
          >
            Next
          </button>
        </div>
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