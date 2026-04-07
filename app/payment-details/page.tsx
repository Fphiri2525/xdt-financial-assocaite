export default function PaymentDetails() {
  return (
    <div className="py-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-[#0B3C5D] mb-8 text-center">Payment Details</h1>
      <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto text-lg">
        We offer multiple convenient ways to repay your loan. Please use your loan account number as the payment reference.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-[#0B3C5D] mb-6 flex items-center">
            <span className="mr-3">🏦</span> Bank Transfer
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Bank Name:</span>
              <span>Global Trust Bank</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Account Name:</span>
              <span>XTData Financial Services</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Account Number:</span>
              <span>1234 5678 9012</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Branch Code:</span>
              <span>GTB001</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">SWIFT/BIC:</span>
              <span>GTBXXX123</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-[#0B3C5D] mb-6 flex items-center">
            <span className="mr-3">📱</span> Mobile Money
          </h2>
          <div className="space-y-6">
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <h3 className="font-bold text-orange-800 mb-2">Network A</h3>
              <p className="text-sm text-gray-700">Paybill Number: <strong>888999</strong></p>
              <p className="text-sm text-gray-700">Account: <strong>[Your Loan ID]</strong></p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <h3 className="font-bold text-yellow-800 mb-2">Network B</h3>
              <p className="text-sm text-gray-700">Merchant Code: <strong>XT-PAY</strong></p>
              <p className="text-sm text-gray-700">Account: <strong>[Your Loan ID]</strong></p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300">
        <h3 className="text-xl font-bold text-[#0B3C5D] mb-4 text-center">Important Notes</h3>
        <ul className="list-disc list-inside space-y-3 text-gray-600 max-w-3xl mx-auto">
          <li>Always include your <strong>Loan Account Number</strong> in the reference field to ensure your payment is credited correctly.</li>
          <li>Payments made via Bank Transfer may take up to 48 hours to reflect in our system.</li>
          <li>Once payment is made, please keep your transaction receipt or SMS confirmation for record-keeping.</li>
          <li>For early repayment or loan settlement, please contact our support team for a final balance statement.</li>
        </ul>
      </div>
    </div>
  );
}
