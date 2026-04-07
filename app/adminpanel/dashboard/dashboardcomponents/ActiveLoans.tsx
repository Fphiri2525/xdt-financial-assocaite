// components/admin/ActiveLoans.tsx
'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { ActiveLoan } from './type';

interface ActiveLoansProps {
  loans: ActiveLoan[];
}

export const ActiveLoans: React.FC<ActiveLoansProps> = ({ loans }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'unpaid':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Unpaid</span>;
      case 'paying':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Paying</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
        <CreditCard size={18} className="text-emerald-500" />
        <h2 className="text-lg font-semibold text-gray-900">Active Loans</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{loan.clientName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">K{loan.approvedAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-green-600">K{loan.paidAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">K{loan.balance.toLocaleString()}</td>
                <td className="px-6 py-4">{getStatusBadge(loan.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveLoans;