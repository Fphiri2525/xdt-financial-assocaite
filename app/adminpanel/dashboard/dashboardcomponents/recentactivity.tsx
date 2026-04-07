// components/admin/RecentActivity.tsx
'use client';

import React from 'react';
import { FileText, Wallet, CheckCircle } from 'lucide-react';

interface RecentActivityProps {
  applications?: number;
  payments?: number;
  approvals?: number;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  applications = 3,
  payments = 2,
  approvals = 1
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <span className="text-sm text-gray-700">Applications</span>
          </div>
          <span className="text-lg font-bold text-blue-600">{applications}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-green-600" />
            <span className="text-sm text-gray-700">Payments</span>
          </div>
          <span className="text-lg font-bold text-green-600">{payments}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-purple-600" />
            <span className="text-sm text-gray-700">Approvals</span>
          </div>
          <span className="text-lg font-bold text-purple-600">{approvals}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;