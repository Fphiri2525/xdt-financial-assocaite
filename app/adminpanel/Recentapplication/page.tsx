// app/page.tsx
"use client";

import { useState } from "react";
import FilterHeader from "../Recentapplication/components/search";
import LoansTable from "../Recentapplication/components/tableloan";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loanTypeFilter, setLoanTypeFilter] = useState("");

  const handleRefresh = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateRange({ start: "", end: "" });
    setLoanTypeFilter("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Header Component */}
        <div className="mb-6">
          <FilterHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            loanTypeFilter={loanTypeFilter}
            onLoanTypeChange={setLoanTypeFilter}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Loans Table Component - NO PROPS PASSED */}
        <LoansTable />
      </div>
    </div>
  );
}