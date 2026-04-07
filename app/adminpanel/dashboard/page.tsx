// app/admin/dashboard/page.tsx
'use client';

import React from 'react';
import {
  Users, FileText, CheckCircle, CreditCard, Wallet, DollarSign, AlertTriangle
} from 'lucide-react';

// Import all components  
import { SummaryCards } from '../dashboard/dashboardcomponents/SummaryCards';
import RecentApplications from '../dashboard/dashboardcomponents/RecentApplications'; // No props needed now
import { PaymentRecords } from '../dashboard/dashboardcomponents/PaymentRecords';
import { RecentActivity } from '../dashboard/dashboardcomponents/recentactivity';

// Import types
import { 
  SummaryCard, 
  PaymentRecord, 
  ActiveLoan, 
  OverdueLoan,
  Notification 
} from '../dashboard/dashboardcomponents/type';

// Mock Data (only for components that still need props)
const summaryCards: SummaryCard[] = [
  { title: 'Total Clients', value: 1248, change: 12.5, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { title: 'Total Applications', value: 356, change: 8.2, icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { title: 'Approved Loans', value: 289, change: 15.3, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
  { title: 'Active Loans', value: 245, change: 5.7, icon: CreditCard, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { title: 'Payments Recorded', value: 'K 1.2M', change: 22.4, icon: Wallet, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { title: 'Outstanding Balance', value: 'K 4.8M', change: -3.2, icon: DollarSign, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { title: 'Overdue Loans', value: 23, change: 8.5, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
];

const paymentRecords: PaymentRecord[] = [
  { id: 1, clientName: 'John Banda', loanId: 'LN-2024-001', amountPaid: 25000, paymentDate: '2024-03-15', method: 'Bank Transfer', remainingBalance: 225000 },
  { id: 2, clientName: 'Mary Phiri', loanId: 'LN-2024-015', amountPaid: 15000, paymentDate: '2024-03-14', method: 'Airtel Money', remainingBalance: 135000 },
  { id: 3, clientName: 'Peter Chimwemwe', loanId: 'LN-2024-023', amountPaid: 50000, paymentDate: '2024-03-14', method: 'Cash', remainingBalance: 450000 },
  { id: 4, clientName: 'Grace Mwale', loanId: 'LN-2024-008', amountPaid: 10000, paymentDate: '2024-03-13', method: 'TNM Mpamba', remainingBalance: 90000 },
  { id: 5, clientName: 'James Kaponda', loanId: 'LN-2024-042', amountPaid: 35000, paymentDate: '2024-03-13', method: 'Bank Transfer', remainingBalance: 315000 },
];

const notifications: Notification[] = [
  { id: 1, message: 'New loan application from John Banda', time: '5 min ago', type: 'application', read: false },
  { id: 2, message: 'Payment of K25,000 recorded for Mary Phiri', time: '1 hour ago', type: 'payment', read: false },
  { id: 3, message: 'Loan approved for Peter Chimwemwe', time: '3 hours ago', type: 'approval', read: true },
  { id: 4, message: 'Overdue alert: Thomas Ngwira (15 days)', time: '5 hours ago', type: 'overdue', read: false },
  { id: 5, message: 'New application from Grace Mwale', time: '1 day ago', type: 'application', read: true },
];

export default function AdminDashboard() {
  const handleAddPayment = () => {
    console.log('Add payment');
  };

  const handleViewAllOverdue = () => {
    console.log('View all overdue');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Summary Cards - Still needs props */}
        <SummaryCards cards={summaryCards} />
        
        {/* Recent Applications - No props needed anymore */}
        <RecentApplications />
        
        {/* Payment Records - Still needs props */}
        <PaymentRecords />
        
        {/* Two Column Layout for Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Active Loans - Still needs props */}
          
          {/* Right Column - Overdue Alerts + Recent Activity */}
          <RecentActivity 
            applications={3}
            payments={2}
            approvals={1}
          />
        </div>
      </div>
    </div>
  );
}