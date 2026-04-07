import { Upload } from 'lucide-react';

interface PaymentSectionProps {
  paymentData: {
    method: string;
    reference: string;
    screenshot: any;
  };
  setPaymentData: (data: any) => void;
}

const PaymentSection = ({ paymentData, setPaymentData }: PaymentSectionProps) => (
  <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-50">
    <h3 className="text-lg font-semibold text-[#0B3C5D] mb-4">Make a Payment</h3>
    
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-2">Payment Method</label>
        <select 
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
          value={paymentData.method}
          onChange={(e) => setPaymentData({...paymentData, method: e.target.value})}
        >
          <option value="">Select payment method</option>
          <option value="national">National Bank</option>
          <option value="airtel">Airtel Money</option>
          <option value="tnm">TNM Mpamba</option>
          <option value="fdh">FDH Bank</option>
          <option value="first">First Capital Bank</option>
          <option value="standard">Standard Bank</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">Transaction Reference</label>
        <input 
          type="text" 
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B3C5D] focus:border-transparent"
          placeholder="Enter transaction reference"
          value={paymentData.reference}
          onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-600 mb-2">Upload Screenshot</label>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-[#0B3C5D] transition-colors cursor-pointer">
          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
        </div>
      </div>
      
      <button 
        type="button"
        className="w-full bg-[#0B3C5D] text-white py-3 rounded-lg hover:bg-[#082d47] transition-colors font-medium"
      >
        Submit Payment
      </button>
      
      <p className="text-xs text-center text-yellow-600 mt-2">
        After submission, your payment will be under review
      </p>
    </form>
  </div>
);

export default PaymentSection;
