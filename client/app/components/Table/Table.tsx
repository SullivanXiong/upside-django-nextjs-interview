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
import { usePaginatedEvents, usePeople, useDashboardStats } from '@/lib/hooks';
import { ActivityEvent, Person } from '@/lib/api/types';

interface TableProps {
  className?: string;
  onPageDateRangeChange?: (startDate: string | null, endDate: string | null) => void;
  targetDate?: string | null;
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

const Table: React.FC<TableProps> = ({ className = '', onPageDateRangeChange, targetDate }) => {
  const [touchpoints, setTouchpoints] = useState<TouchpointData[]>([]);
  const [pageSize, setPageSize] = useState(50); // Default to 50
  const pageSizeOptions = [10, 25, 50, 100];
  
  // Fetch paginated data from API - sort by ascending date (oldest first)
  const { 
    data: eventsData, 
    loading: eventsLoading, 
    error: eventsError, 
    currentPage,
    setPage,
    refetch: refetchEvents 
  } = usePaginatedEvents({ 
    page_size: pageSize,
    sort_by: 'timestamp'  // Remove the '-' to sort ascending (oldest first)
  });
  const { data: peopleData, loading: peopleLoading, error: peopleError } = usePeople();
  const { data: statsData } = useDashboardStats();
  
  // Notify parent about page date range changes
  useEffect(() => {
    if (!onPageDateRangeChange) return;
    const range = eventsData?.date_range?.current_page;
    if (!range) return;
    onPageDateRangeChange(range.start, range.end);
  }, [eventsData?.date_range?.current_page?.start, eventsData?.date_range?.current_page?.end, onPageDateRangeChange]);
  
  // Handle navigation when chart is clicked
  useEffect(() => {
    const navigateToDate = async () => {
      if (!targetDate || !eventsData) return;
      
      console.log('Navigating to date:', targetDate);
      const targetTime = new Date(targetDate).getTime();
      
      // Since events are sorted by date (newest first by default),
      // we need to find which page contains the target date
      
      // Get the overall date range
      if (eventsData.date_range?.overall) {
        const overallStartStr = eventsData.date_range.overall.start;
        const overallEndStr = eventsData.date_range.overall.end;
        if (!overallStartStr || !overallEndStr) {
          return;
        }
        const overallStart = new Date(overallStartStr).getTime();
        const overallEnd = new Date(overallEndStr).getTime();
        
        // Check if target date is within the data range
        if (targetTime < overallStart || targetTime > overallEnd) {
          console.log('Target date is outside data range');
          return;
        }
        
        // Estimate the page based on date position
        // This is approximate - for exact navigation, you'd need to know event distribution
        const totalRange = overallEnd - overallStart;
        const targetPosition = targetTime - overallStart;
        const relativePosition = targetPosition / totalRange;
        
        // Since oldest events are first now (ascending order), use direct position
        const position = relativePosition;
        
        // Calculate the target page
        const totalPages = eventsData.pagination.total_pages;
        const estimatedPage = Math.max(1, Math.min(
          totalPages,
          Math.ceil(position * totalPages)
        ));
        
        console.log('Estimated page for date:', estimatedPage);
        
        if (estimatedPage !== currentPage) {
          setPage(estimatedPage);
        }
      }
    };
    
    navigateToDate();
  }, [targetDate, eventsData, currentPage, setPage]);
  
  // Transform API data to table format
  useEffect(() => {
    if (eventsData?.results && peopleData) {
      const transformedData: TouchpointData[] = eventsData.results.map((event, index) => {
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
  const totalCount = eventsData?.pagination?.total_count || statsData?.total_events || touchpoints.length;
  const totalPages = eventsData?.pagination?.total_pages || 1;
  const hasNext = eventsData?.pagination?.has_next || false;
  const hasPrevious = eventsData?.pagination?.has_previous || false;
  
  const handleRefresh = () => {
    refetchEvents();
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
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
  
  // Calculate if scrolling is needed
  const needsScroll = displayData.length > 10;

  return (
    <div className={`bg-card text-card-foreground rounded-lg border border-border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-green-600">Touchpoints</h2>
          <span className="text-sm text-muted-foreground">[{totalCount} total]</span>
        </div>
        <button 
          className="text-muted-foreground hover:text-foreground p-2 transition-colors"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshIcon size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading touchpoints...</div>
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
      <div className="relative">
        {needsScroll && (
          <div className="absolute right-4 top-2 z-20 text-xs text-muted-foreground bg-card px-2 py-1 rounded shadow-sm">
            ↕ Scroll for more
          </div>
        )}
        <div className="overflow-auto max-h-[600px] relative border-t border-border scroll-smooth">
          <table className="w-full">
          <thead className="bg-muted sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-6 py-3 text-left">
                <button className="text-muted-foreground hover:text-foreground">
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
          <tbody className="divide-y divide-border">
            {displayData.map((touchpoint, index) => (
              <TableRow key={touchpoint.id} isEven={index % 2 === 0}>
                <TableData>
                  <TypeCell type={touchpoint.type} />
                </TableData>
                <TableData>
                  <span className="text-sm text-foreground">{touchpoint.date}</span>
                </TableData>
                <TableData>
                  <span className="text-sm text-foreground">{touchpoint.activity}</span>
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
      </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !hasError && (
      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-sm text-muted-foreground">
              ({totalCount} total items)
            </span>
          </div>
          
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-foreground">Page Size:</label>
            <select
				  value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
						 {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(currentPage - 1)}
            disabled={!hasPrevious}
            className="px-3 py-1 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    currentPage === pageNum
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground bg-card border border-border hover:bg-muted'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setPage(currentPage + 1)}
            disabled={!hasNext}
            className="px-3 py-1 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        )}
      </div>
      )}
    </div>
  );
};

export default Table;
