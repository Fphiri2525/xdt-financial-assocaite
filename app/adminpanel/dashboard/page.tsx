// app/admin/dashboard/page.tsx
'use client';

import React from 'react';
import { SummaryCards } from '../dashboard/dashboardcomponents/SummaryCards';
import RecentApplications from '../dashboard/dashboardcomponents/RecentApplications';
import { PaymentRecords } from '../dashboard/dashboardcomponents/PaymentRecords';
import { RecentActivity } from '../dashboard/dashboardcomponents/recentactivity';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Summary Cards - Now fetches data directly from API */}
        <SummaryCards />
        
        {/* Recent Applications */}
        <RecentApplications />
        
        {/* Payment Records */}
        <PaymentRecords  />
        
        {/* Recent Activity */}
        <RecentActivity 
          applications={0}
          payments={0}
          approvals={0}
        />
      </div>
    </div>
  );
}