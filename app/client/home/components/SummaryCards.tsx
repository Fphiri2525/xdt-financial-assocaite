interface SummaryCardsProps {
  loanSummary: {
    currentLoan: {
      amount: number;
      totalRepayment: number;
      dueDate: string;
      status: string;
      interest: number;
      daysRemaining: number;
    }
  };
  statusColors: Record<string, string>;
}

const SummaryCards = ({ loanSummary, statusColors }: SummaryCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6  items-stretch">
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-50 flex flex-col justify-between">
      <p className="text-sm text-gray-500 mb-1">Loan Amount</p>
      <p className="text-2xl font-bold text-[#0B3C5D]">
        MWK {loanSummary.currentLoan.amount.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-2">Out of MWK 200,000 limit</p>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-50 flex flex-col justify-between">
      <p className="text-sm text-gray-500 mb-1">Total Repayment</p>
      <p className="text-2xl font-bold text-[#0B3C5D]">
        MWK {loanSummary.currentLoan.totalRepayment.toLocaleString()}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Incl. MWK {loanSummary.currentLoan.interest.toLocaleString()} interest
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-50 flex flex-col justify-between">
      <p className="text-sm text-gray-500 mb-1">Due Date</p>
      <p className="text-2xl font-bold text-[#0B3C5D]">
        {new Date(loanSummary.currentLoan.dueDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        {loanSummary.currentLoan.daysRemaining} days remaining
      </p>
    </div>

    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-50 flex flex-col justify-between">
      <p className="text-sm text-gray-500 mb-1">Loan Status</p>
      <div className="flex items-center h-9">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[loanSummary.currentLoan.status]
          }`}
        >
          {loanSummary.currentLoan.status}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2">Last updated: Today</p>
    </div>
  </div>
);

export default SummaryCards;




