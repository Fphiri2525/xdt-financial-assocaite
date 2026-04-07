// components/admin/OverdueAlerts.tsx
'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { OverdueLoan } from './type';

interface OverdueAlertsProps {
  overdueLoans: OverdueLoan[];
  onViewAll?: () => void;
}

export const OverdueAlerts: React.FC<OverdueAlertsProps> = ({ overdueLoans, onViewAll }) => {
  return (
    <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-red-50 border-b border-red-200">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-600" />
          <h2 className="text-lg font-semibold text-red-700">Overdue Loans Alert ⚠️</h2>
        </div>
      </div>
      <div className="divide-y divide-red-100">
        {overdueLoans.map((loan) => (
          <div key={loan.id} className="px-6 py-4 flex items-center justify-between hover:bg-red-50/50">
            <div>
              <p className="text-sm font-medium text-gray-900">{loan.clientName}</p>
              <p className="text-xs text-red-600 mt-1">{loan.daysOverdue} days overdue</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">K{loan.amountRemaining.toLocaleString()}</p>
              <p className="text-xs text-gray-500">remaining</p>
            </div>
          </div>
        ))}
        <div className="px-6 py-3 bg-gray-50 text-center">
          <button 
            onClick={onViewAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            View All Overdue Loans
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverdueAlerts;