// app/components/LoanForm/components/steps/ReviewStep.tsx
import React from 'react';
import { ChevronLeft, DollarSign } from 'lucide-react';
import { FormData } from './type';

interface ReviewStepProps {
  darkMode: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isSubmitting: boolean;
  calculatedInterest: number;
  totalRepayment: number;
  getCurrentInterestRate: () => string;
  userEmail: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  darkMode,
  formData,
  setFormData,
  isSubmitting,
  calculatedInterest,
  totalRepayment,
  getCurrentInterestRate,
  userEmail,
  onBack,
  onSubmit
}) => {
  const MAX_LOAN = 200000;
  const DURATION_OPTIONS = [1, 2, 3, 4];

  return (
    <form onSubmit={onSubmit}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Review & Loan Details
      </h2>
      
      <div className="space-y-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <h3 className={`font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <DollarSign size={18} className="mr-2" />
            Loan Request
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Loan Amount (K) (Optional - Default: K1,000)
              </label>
              <input
                type="number"
                min="0"
                max={MAX_LOAN}
                value={formData.loanAmount}
                onChange={(e) => setFormData({...formData, loanAmount: Number(e.target.value)})}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Repayment Duration (Weeks)
              </label>
              <select
                value={formData.loanDuration}
                onChange={(e) => setFormData({...formData, loanDuration: Number(e.target.value)})}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {DURATION_OPTIONS.map(weeks => (
                  <option key={weeks} value={weeks}>
                    {weeks} week{weeks > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {formData.loanAmount > 0 && (
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Loan Calculation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Principal Amount:</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  K{formData.loanAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Interest Rate:</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {getCurrentInterestRate()}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Interest Amount:</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  K{calculatedInterest.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>Total Repayment:</span>
                  <span className="text-green-600">
                    K{totalRepayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Weekly Payment:</span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    K{(totalRepayment / (formData.loanDuration || 1)).toLocaleString()} per week
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Application Summary
          </h3>
          <div className="space-y-2 text-sm">
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              <span className="font-medium">Email:</span> {userEmail}
            </p>
            {formData.dateOfBirth && (
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <span className="font-medium">Date of Birth:</span> {new Date(formData.dateOfBirth).toLocaleDateString()}
              </p>
            )}
            {formData.nationalId && (
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <span className="font-medium">National ID:</span> {formData.nationalId}
              </p>
            )}
            {formData.borrowerPhone && (
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <span className="font-medium">Phone:</span> {formData.borrowerPhone}
              </p>
            )}
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              <span className="font-medium">ID Images:</span> {formData.frontIdImage ? '✓ Front' : '✗ Front'} | {formData.backIdImage ? '✓ Back' : '✗ Back'}
            </p>
            {formData.kinFullName && (
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <span className="font-medium">Next of Kin:</span> {formData.kinFullName}
              </p>
            )}
            {formData.occupationName && (
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <span className="font-medium">Occupation:</span> {formData.occupationName}
              </p>
            )}
            {formData.collateralType && (
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                <span className="font-medium">Collateral:</span> {formData.collateralType}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition flex items-center"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-green-400 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'SUBMIT APPLICATION'
          )}
        </button>
      </div>
    </form>
  );
};