// app/components/LoanForm/components/steps/CollateralStep.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Camera, X } from 'lucide-react';
import { FormData } from '../components/loanformcomponents/type';

interface CollateralStepProps {
  darkMode: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isSubmitting: boolean;
  onBack?: () => void; // ← now optional
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CollateralStep: React.FC<CollateralStepProps> = ({
  darkMode,
  formData,
  setFormData,
  isSubmitting,
  onBack,
  onImageUpload,
  onRemoveImage,
  onSubmit
}) => {
  const collateralOptions = [
    'Laptop', 'Smartphone', 'Tablet', 'Camera', 'Smartwatch',
    'Projector', 'Speaker', 'HardDrive', 'Microwave', 'Iron',
    'TV', 'Radio', 'Bicycle', 'Other'
  ];

  return (
    <form onSubmit={onSubmit}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Collateral Details (Optional)
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Collateral Type
          </label>
          <select
            value={formData.collateralType}
            onChange={(e) => setFormData({...formData, collateralType: e.target.value})}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select collateral type (optional)</option>
            {collateralOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            value={formData.collateralDescription}
            onChange={(e) => setFormData({...formData, collateralDescription: e.target.value})}
            rows={3}
            placeholder="Describe the item (optional)"
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Pictures of Collateral (Optional)
          </label>
          <div className={`border-2 border-dashed rounded-lg p-4 ${
            darkMode ? 'border-gray-600' : 'border-gray-300'
          }`}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageUpload}
              className="hidden"
              id="collateral-images"
            />
            <label
              htmlFor="collateral-images"
              className="flex flex-col items-center cursor-pointer"
            >
              <Camera className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Click to upload images
              </span>
            </label>
          </div>

          {Array.isArray(formData.collateralImages) && formData.collateralImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {formData.collateralImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Collateral ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        {/* Only render Back button when onBack is provided */}
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition flex items-center"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back
          </button>
        ) : (
          <div /> // spacer to keep Submit button on the right
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center disabled:bg-blue-400"
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