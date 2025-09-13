'use client';

import React from 'react';
import { useApiData } from '@/lib/hooks/useApiData';
import { apiClient, DashboardStats } from '@/lib/api';

interface DashboardStatsProps {
  className?: string;
  customerOrgId?: string;
  days?: number;
}

const DashboardStatsComponent: React.FC<DashboardStatsProps> = ({ 
  className = '', 
  customerOrgId = 'org_4m6zyrass98vvtk3xh5kcwcmaf',
  days = 30 
}) => {
  const { data: stats, loading, error, refetch } = useApiData<DashboardStats>(
    () => apiClient.getDashboardStats(customerOrgId, days),
    [customerOrgId, days]
  );

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-red-500">
          Error loading stats: {error}
          <button 
            onClick={refetch}
            className="ml-2 text-blue-500 hover:text-blue-700 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats.total_events.toLocaleString(),
      subtitle: `Last ${days} days`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total People',
      value: stats.total_people.toLocaleString(),
      subtitle: 'Active contacts',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Recent Activity',
      value: stats.recent_events.toLocaleString(),
      subtitle: 'Last 7 days',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Top Channel',
      value: stats.channel_breakdown[0]?.channel || 'N/A',
      subtitle: `${stats.channel_breakdown[0]?.count || 0} events`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <div className={`w-6 h-6 rounded-full ${card.color.replace('text-', 'bg-').replace('-600', '-200')}`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStatsComponent;