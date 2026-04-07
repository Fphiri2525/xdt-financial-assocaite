'use client';

export default function LoanHistoryPage() {
  const loans = [
    { id: 'LN001', name: 'John Doe', amount: 25000, status: 'Active' },
    { id: 'LN002', name: 'Jane Smith', amount: 15000, status: 'Paid' },
    { id: 'LN003', name: 'Robert Johnson', amount: 30000, status: 'Pending' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Loan History</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Loan ID</th>
            <th className="border p-2">Borrower</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>

        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id}>
              <td className="border p-2">{loan.id}</td>
              <td className="border p-2">{loan.name}</td>
              <td className="border p-2">${loan.amount}</td>
              <td className="border p-2">{loan.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}