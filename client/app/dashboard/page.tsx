'use client';

import React from 'react';
import { Chart } from '@/components/Chart';
import { Table } from '@/components/Table';
import { DashboardStats } from '@/components/DashboardStats';
import ModeToggle from '@/components/darkmode-toggle/darkmode-toggle';

export default function Dashboard() {
  // These would typically come from user context, URL params, or props
  const customerOrgId = 'org_4m6zyrass98vvtk3xh5kcwcmaf'; // Correct ID from the database
  const accountId = 'account_31crr1tcp2bmcv1fk6pcm0k6ag';
  const days = 30;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-row mb-8">
				<div>
					 <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					 <p className="text-gray-600 mt-2">Overview of your data and touchpoints</p>
				</div>
				<div>
					<ModeToggle />
				</div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats 
          customerOrgId={customerOrgId}
          days={days}
          className="mb-6"
        />

        {/* Chart Component */}
        <Chart 
          className="mb-6" 
          customerOrgId={customerOrgId}
          days={days}
        />

        {/* Table Component */}
        <Table 
          customerOrgId={customerOrgId}
          accountId={accountId}
        />
      </div>
    </div>
  );
}
