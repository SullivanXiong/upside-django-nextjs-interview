'use client';

import React from 'react';
import { Chart } from '@/components/Chart';
import { Table } from '@/components/Table';
import ModeToggle from '@/components/darkmode-toggle/darkmode-toggle';

export default function Dashboard() {
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

        {/* Chart Component */}
        <Chart className="mb-6" />

        {/* Table Component */}
        <Table />
      </div>
    </div>
  );
}
