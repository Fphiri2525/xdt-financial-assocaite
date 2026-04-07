// components/admin/SummaryCards.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, HandCoins, CheckCircle, Clock, AlertCircle, XCircle, DollarSign } from 'lucide-react';
import { SummaryCard } from './type';

interface SummaryCardsProps {
  cards?: SummaryCard[];
}

interface LoanSummary {
  total_loans: number;
  approved_loans: number;
  active_loans: number;
  pending_loans: number;
  rejected_loans: number;
  completed_loans: number;
  not_completed_loans: number;
}

interface ClientStats {
  total_clients: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ cards: propCards }) => {
  const [loanSummary, setLoanSummary] = useState<LoanSummary | null>(null);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://loan-backend-production-558e.up.railway.app';
        
        const [loanSummaryRes, clientTotalRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/loans/summary`),
          fetch(`${API_BASE_URL}/api/users/total-clients`)
        ]);

        if (!loanSummaryRes.ok) {
          throw new Error(`Failed to fetch loan summary: ${loanSummaryRes.status}`);
        }
        
        if (!clientTotalRes.ok) {
          throw new Error(`Failed to fetch client totals: ${clientTotalRes.status}`);
        }

        const loanData = await loanSummaryRes.json();
        const clientData = await clientTotalRes.json();

        setLoanSummary(loanData.data);
        setClientStats({ total_clients: clientData.total });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Create cards with REAL data from API (removed Approved, Active, and Rejected Loans)
  const realDataCards: SummaryCard[] = [
    {
      title: 'Total Clients',
      value: clientStats?.total_clients?.toLocaleString() || '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: 12.5
    },
    {
      title: 'Total Applications',
      value: loanSummary?.total_loans?.toLocaleString() || '0',
      icon: HandCoins,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 8.2
    },
    {
      title: 'Pending Loans',
      value: loanSummary?.pending_loans?.toLocaleString() || '0',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: -3.1
    },
    {
      title: 'Completed Loans',
      value: loanSummary?.completed_loans?.toLocaleString() || '0',
      icon: DollarSign,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      change: 10.8
    }
  ];

  // Use real data cards if available, otherwise use propCards or empty array
  const cardsToRender = (loanSummary && clientStats) ? realDataCards : (propCards || []);
  
  // Filter out specific cards if needed
  const filteredCards = cardsToRender.filter(card => 
    card.title !== 'Payments Recorded' && 
    card.title !== 'Outstanding Balance' && 
    card.title !== 'Overdue Loans'
  );

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="flex items-end justify-between">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading dashboard: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
        <select className="text-sm border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-600">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This month</option>
          <option>This year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
        {filteredCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow min-w-[180px]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`${card.bgColor} p-3 rounded-lg shrink-0`}>
                  <Icon size={22} className={card.color} />
                </div>
                <span className="text-sm text-gray-500 uppercase tracking-wider truncate font-medium">
                  {card.title}
                </span>
              </div>
              
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                {card.change !== undefined && (
                  <span className={`text-sm flex items-center gap-1 whitespace-nowrap font-medium ${
                    card.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(card.change)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryCards;