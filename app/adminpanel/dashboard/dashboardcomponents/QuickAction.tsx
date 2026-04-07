// components/admin/QuickActions.tsx
'use client';

import React from 'react';
import { ThumbsUp, Plus, Search, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  onApproveLoan?: () => void;
  onAddPayment?: () => void;
  onSearchClient?: () => void;
  onViewReports?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onApproveLoan,
  onAddPayment,
  onSearchClient,
  onViewReports
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={onApproveLoan}
          className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
        >
          <ThumbsUp size={20} className="text-blue-600 mx-auto mb-2" />
          <span className="text-xs font-medium text-blue-700">Approve Loan</span>
        </button>
        <button 
          onClick={onAddPayment}
          className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center"
        >
          <Plus size={20} className="text-green-600 mx-auto mb-2" />
          <span className="text-xs font-medium text-green-700">Add Payment</span>
        </button>
        <button 
          onClick={onSearchClient}
          className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center"
        >
          <Search size={20} className="text-purple-600 mx-auto mb-2" />
          <span className="text-xs font-medium text-purple-700">Search Client</span>
        </button>
        <button 
          onClick={onViewReports}
          className="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors text-center"
        >
          <BarChart3 size={20} className="text-amber-600 mx-auto mb-2" />
          <span className="text-xs font-medium text-amber-700">View Reports</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;