// components/admin/types.ts
import { ReactElement } from 'react';

export interface SummaryCard {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

export interface RecentApplication {
  id: number;
  clientName: string;
  email: string;
  amount: number;
  purpose: string;
  dateApplied: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface PaymentRecord {
  id: number;
  clientName: string;
  loanId: string;
  amountPaid: number;
  paymentDate: string;
  method: string;
  remainingBalance: number;
}

export interface ActiveLoan {
  id: number;
  clientName: string;
  approvedAmount: number;
  paidAmount: number;
  balance: number;
  status: 'unpaid' | 'paying' | 'completed';
}

export interface OverdueLoan {
  id: number;
  clientName: string;
  daysOverdue: number;
  amountRemaining: number;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'application' | 'payment' | 'approval' | 'overdue';
  read: boolean;
}