'use client';

import React from 'react';

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
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        );
      case 'booked':
      case 'chatted':
      case 'replied':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      case 'sent':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        );
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Date</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Activity</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">People</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700"># Channel</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="px-6 py-3 text-left">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Team</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {touchpoints.map((touchpoint, index) => (
              <tr key={touchpoint.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    <svg 
                      className={`w-4 h-4 ${touchpoint.type === 'outgoing' ? 'text-blue-600' : 'text-pink-600'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
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