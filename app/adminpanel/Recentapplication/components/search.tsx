"use client";

import { Dispatch, SetStateAction } from "react";

interface DateRange {
  start: string;
  end: string;
}

interface FilterHeaderProps {
  searchTerm: string;
  onSearchChange: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  onStatusChange: Dispatch<SetStateAction<string>>;
  dateRange: DateRange;
  onDateRangeChange: Dispatch<SetStateAction<DateRange>>;
  loanTypeFilter: string;
  onLoanTypeChange: Dispatch<SetStateAction<string>>;
  onRefresh: () => void;
}

export default function FilterHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  loanTypeFilter,
  onLoanTypeChange,
  onRefresh,
}: FilterHeaderProps) {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
        {/* Search Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Search</label>
          <input
            type="text"
            placeholder="Search name, phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Loan Type Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Type</label>
          <select
            value={loanTypeFilter}
            onChange={(e) => onLoanTypeChange(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          >
            <option value="">All Types</option>
            <option value="Personal">Personal</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, start: e.target.value })
            }
            className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, end: e.target.value })
            }
            className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
          />
        </div>

        {/* Refresh Button */}
        <div>
          <button
            onClick={onRefresh}
            className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
