interface LoanHistoryTableProps {
  loanHistory: Array<{
    id: string;
    amount: number;
    status: string;
    date: string;
  }>;
  statusColors: Record<string, string>;
}

const LoanHistoryTable = ({ loanHistory, statusColors }: LoanHistoryTableProps) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-50">
    <h3 className="text-lg font-semibold text-[#0B3C5D] mb-4">Loan History</h3>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 text-sm font-medium text-gray-500">Loan ID</th>
            <th className="text-left py-3 text-sm font-medium text-gray-500">Amount</th>
            <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
            <th className="text-left py-3 text-sm font-medium text-gray-500">Date</th>
            <th className="text-left py-3 text-sm font-medium text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {loanHistory.map((loan) => (
            <tr key={loan.id} className="border-b border-gray-50">
              <td className="py-3 text-sm">{loan.id}</td>
              <td className="py-3 text-sm">MWK {loan.amount.toLocaleString()}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[loan.status]}`}>
                  {loan.status}
                </span>
              </td>
              <td className="py-3 text-sm">{loan.date}</td>
              <td className="py-3">
                <button className="text-[#0B3C5D] hover:underline text-sm">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LoanHistoryTable;
