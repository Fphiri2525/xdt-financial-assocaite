// app/client/home/components/loanformcomponents/ProgressSteps.tsx
'use client';

import React from 'react';
import { Step } from './type';

interface ProgressStepsProps {
  currentStep: Step;
  darkMode: boolean;
  onStepClick: (step: Step) => void;
  steps?: Step[];  // Optional - allows external step configuration
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  currentStep, 
  darkMode, 
  onStepClick,
  steps: externalSteps 
}) => {
  // Use provided steps or default to all steps
  const steps = externalSteps || ['borrower', 'kin', 'collateral', 'review'];
  const currentIndex = steps.indexOf(currentStep);

  // Don't render if current step isn't in the steps array
  if (currentIndex === -1) return null;

  const getStepLabel = (step: Step): string => {
    switch (step) {
      case 'borrower': return 'Personal Details';
      case 'kin': return 'Next of Kin';
      case 'collateral': return 'Collateral';
      case 'review': return 'Review';
      default: return step;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onStepClick(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 scale-110 cursor-default' 
                    : index < currentIndex
                    ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                    : darkMode 
                      ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 cursor-pointer' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer'
                }`}
                disabled={currentStep === step}
              >
                {index + 1}
              </button>
              <span className={`text-xs mt-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {getStepLabel(step)}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
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