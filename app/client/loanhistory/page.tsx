Here is a simple, ready-to-use loan history page built with Next.js and TypeScript.
```tsx
// app/loan-history/page.tsx
'use client';

import React, { useState } from 'react';

// Define the structure of a loan record
interface LoanRecord {
  id: string;
  borrowerName: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  status: 'active' | 'paid' | 'defaulted' | 'pending';
  startDate: string;
  endDate: string;
  nextPaymentDue?: string;
}

// Sample loan data
const sampleLoans: LoanRecord[] = [
  {
    id: 'LN-001',
    borrowerName: 'John Doe',
    amount: 25000,
    interestRate: 5.5,
    termMonths: 36,
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2027-01-15',
    nextPaymentDue: '2024-06-15',
  },
  {
    id: 'LN-002',
    borrowerName: 'Jane Smith',
    amount: 15000,
    interestRate: 4.2,
    termMonths: 24,
    status: 'paid',
    startDate: '2022-03-10',
    endDate: '2024-03-10',
    nextPaymentDue: undefined,
  },
  {
    id: 'LN-003',
    borrowerName: 'Robert Johnson',
    amount: 50000,
    interestRate: 6.0,
    termMonths: 60,
    status: 'active',
    startDate: '2023-11-01',
    endDate: '2028-11-01',
    nextPaymentDue: '2024-06-01',
  },
  {
    id: 'LN-004',
    borrowerName: 'Emily Davis',
    amount: 8000,
    interestRate: 3.9,
    termMonths: 12,
    status: 'defaulted',
    startDate: '2023-09-20',
    endDate: '2024-09-20',
    nextPaymentDue: '2024-05-20',
  },
  {
    id: 'LN-005',
    borrowerName: 'Michael Brown',
    amount: 35000,
    interestRate: 5.0,
    termMonths: 48,
    status: 'pending',
    startDate: '2024-05-01',
    endDate: '2028-05-01',
    nextPaymentDue: '2024-06-01',
  },
];

export default function LoanHistoryPage() {
  const [loans, setLoans] = useState<LoanRecord[]>(sampleLoans);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter loans based on status and search term
  const filteredLoans = loans.filter((loan) => {
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status badge color
  const getStatusBadge = (status: LoanRecord['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      paid: 'bg-blue-100 text-blue-800',
      defaulted: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status];
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loan History</h1>
          <p className="text-gray-600 mt-2">View and manage all loan records</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by borrower name or loan ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="paid">Paid</option>
                <option value="defaulted">Defaulted</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Loans</p>
            <p className="text-2xl font-bold text-gray-900">{loans.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(loans.reduce((sum, loan) => sum + loan.amount, 0))}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Active Loans</p>
            <p className="text-2xl font-bold text-green-600">
              {loans.filter((l) => l.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <p className="text-sm text-gray-600">Defaulted Loans</p>
            <p className="text-2xl font-bold text-red-600">
              {loans.filter((l) => l.status === 'defaulted').length}
            </p>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {loan.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {loan.borrowerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(loan.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {loan.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {loan.termMonths} months
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(loan.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(loan.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {loan.nextPaymentDue ? formatDate(loan.nextPaymentDue) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                            loan.status
                          )}`}
                        >
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      No loans found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {filteredLoans.length} of {loans.length} loans
        </div>
      </div>
    </div>
  );
}
```