// app/client/home/components/LoanInfo.tsx
'use client';

import React, { useState } from 'react';
import { ProgressSteps } from '../../../components/LoanForm/components/ProgressSteps';
import { Step } from '../../../components/LoanForm/components/type';

interface LoanInfoProps {
  darkMode?: boolean;
  initialStep?: Step;
}

export default function LoanInfo({ 
  darkMode = false, 
  initialStep = 'borrower' 
}: LoanInfoProps) {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);

  const handleStepClick = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressSteps
        currentStep={currentStep}
        onStepClick={handleStepClick}
        darkMode={darkMode}
      />
      
      <div className="mt-8">
        {currentStep === 'borrower' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            {/* Add your borrower form fields here */}
          </div>
        )}
        
        {currentStep === 'kin' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Next of Kin</h2>
            {/* Add your next of kin form fields here */}
          </div>
        )}
        
        {currentStep === 'collateral' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Collateral Information</h2>
            {/* Add your collateral form fields here */}
          </div>
        )}
        
        {currentStep === 'review' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Review Application</h2>
            {/* Add review summary here */}
          </div>
        )}
      </div>
    </div>
  );
}