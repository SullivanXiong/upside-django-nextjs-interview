'use client';

import React, { useState, useRef } from 'react';
import { Chart } from '@/components/Chart';
import { Table } from '@/components/Table';
import ModeToggle from '@/components/darkmode-toggle/darkmode-toggle';

export default function Dashboard() {
  const [paginationRange, setPaginationRange] = useState<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });
  
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const tableRef = useRef<any>(null);

  const handlePageDateRangeChange = (start: string | null, end: string | null) => {
    setPaginationRange({ start, end });
  };
  
  const handleChartClick = (date: string) => {
    // Set the target date to navigate the table to
    setTargetDate(date);
    // The Table component will handle navigation when targetDate changes
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-row mb-8">
				<div>
					 <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
					 <p className="text-muted-foreground mt-2">Overview of your data and touchpoints</p>
				</div>
				<div>
					<ModeToggle />
				</div>
        </div>

        {/* Chart Component */}
        <Chart 
          className="mb-6" 
          paginationRange={paginationRange}
          onChartClick={handleChartClick}
        />

        {/* Table Component */}
        <Table 
          onPageDateRangeChange={handlePageDateRangeChange}
          targetDate={targetDate}
        />
      </div>
    </div>
  );
}
