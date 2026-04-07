// app/page.tsx
"use client";

import { useState } from "react";
import FilterHeader from "../Recentapplication/components/search";
import LoansTable from "../Recentapplication/components/tableloan";

// Minimal sample data
const mockLoans = [
  {
    id: 1,
    name: "John Doe",
    phone: "+1234567890",
    nationalId: "ID123456",
    amount: 5000,
    status: "Pending",
    date: "2024-03-15",
    loanType: "Personal",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "+1987654321",
    nationalId: "ID789012",
    amount: 10000,
    status: "Approved",
    date: "2024-03-10",
    loanType: "Business",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loanTypeFilter, setLoanTypeFilter] = useState("");
  const [loans] = useState(mockLoans);

  // Filter loans based on all criteria
  const filteredLoans = loans.filter((loan) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.phone.includes(searchTerm) ||
      loan.nationalId.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "" || loan.status === statusFilter;

    // Loan type filter
    const matchesLoanType =
      loanTypeFilter === "" || loan.loanType === loanTypeFilter;

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const loanDate = new Date(loan.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = loanDate >= startDate && loanDate <= endDate;
    } else if (dateRange.start) {
      const loanDate = new Date(loan.date);
      const startDate = new Date(dateRange.start);
      matchesDateRange = loanDate >= startDate;
    } else if (dateRange.end) {
      const loanDate = new Date(loan.date);
      const endDate = new Date(dateRange.end);
      matchesDateRange = loanDate <= endDate;
    }

    return (
      matchesSearch && matchesStatus && matchesLoanType && matchesDateRange
    );
  });

  const handleRefresh = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateRange({ start: "", end: "" });
    setLoanTypeFilter("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        

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

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">

            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{filteredLoans.length}</span> of <span className="font-medium text-gray-900">{loans.length}</span> applications
            </div>
          </div>
          
          {/* Loans Table Component */}
          <LoansTable loans={filteredLoans} />
        </div>
      </div>
    </div>
  );
}
