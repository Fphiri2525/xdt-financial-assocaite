// app/components/LoanForm/components/steps/BorrowerStep.tsx
import React from 'react';
import { ChevronRight, IdCard, X } from 'lucide-react';
import { FormData } from './type';

interface BorrowerStepProps {
  darkMode: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isSubmitting: boolean;
  userEmail: string; // Kept as parameter but not displayed
  onIdImageUpload: (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveIdImage: (type: 'front' | 'back') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BorrowerStep: React.FC<BorrowerStepProps> = ({
  darkMode,
  formData,
  setFormData,
  isSubmitting,
  userEmail, // Parameter received but not displayed
  onIdImageUpload,
  onRemoveIdImage,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Personal Details
      </h2>
      
      <div className="space-y-4">
        {/* ID Images Upload */}
        <div className="space-y-4 mb-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Front of ID Card (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onIdImageUpload('front', e)}
                className="hidden"
                id="front-id"
              />
              <label
                htmlFor="front-id"
                className="flex flex-col items-center cursor-pointer"
              >
                <IdCard className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.frontIdImage ? formData.frontIdImage.name : 'Click to upload front of ID'}
                </span>
              </label>
            </div>
            {formData.frontIdImage && (
              <div className="mt-2 relative inline-block">
                <img
                  src={URL.createObjectURL(formData.frontIdImage)}
                  alt="Front ID"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveIdImage('front')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Back of ID Card (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-lg p-4 ${
              darkMode ? 'border-gray-600' : 'border-gray-300'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onIdImageUpload('back', e)}
                className="hidden"
                id="back-id"
              />
              <label
                htmlFor="back-id"
                className="flex flex-col items-center cursor-pointer"
              >
                <IdCard className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.backIdImage ? formData.backIdImage.name : 'Click to upload back of ID'}
                </span>
              </label>
            </div>
            {formData.backIdImage && (
              <div className="mt-2 relative inline-block">
                <img
                  src={URL.createObjectURL(formData.backIdImage)}
                  alt="Back ID"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveIdImage('back')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              National ID Number (Optional)
            </label>
            <input
              type="text"
              value={formData.nationalId}
              onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={formData.borrowerPhone}
              onChange={(e) => setFormData({...formData, borrowerPhone: e.target.value})}
              placeholder="Enter your phone number"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alternative Phone Number
            </label>
            <input
              type="tel"
              value={formData.alternativePhone}
              onChange={(e) => setFormData({...formData, alternativePhone: e.target.value})}
              placeholder="Alternative contact number"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Address Information */}
        <div className="mt-6">
          <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                City (Optional)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="City/Town"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Street (Optional)
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                placeholder="Street name"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                House Number (Optional)
              </label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                placeholder="House/Building number"
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              Save & Continue
              <ChevronRight size={20} className="ml-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};