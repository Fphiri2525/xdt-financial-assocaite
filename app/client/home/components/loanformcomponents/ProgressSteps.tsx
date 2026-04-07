// app/components/LoanForm/components/ProgressSteps.tsx
import React from 'react';
import { Step } from './type';

interface ProgressStepsProps {
  currentStep: Step;
  darkMode: boolean;
  onStepClick: (step: Step) => void;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep, 
  darkMode, 
  onStepClick 
}) => {
  const steps: Step[] = ['borrower', 'kin', 'collateral', 'review'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 scale-110' 
                    : index < currentIndex
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                onClick={() => onStepClick(step)}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {step === 'borrower' ? 'Personal Details' : 
                 step === 'kin' ? 'Next of Kin' : 
                 step === 'collateral' ? 'Collateral' : 'Review'}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                index < currentIndex
                  ? 'bg-green-500'
                  : darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};