'use client';

import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { ProgressSteps } from './loanformcomponents/ProgressSteps';
import { Notification } from './loanformcomponents/notification';
import { BorrowerStep } from './loanformcomponents/BorrowerStep';
import { KinStep } from './loanformcomponents/KinStep';
import { CollateralStep } from './loanformcomponents/CollateralStep';
import { ReviewStep } from './loanformcomponents/ReviewStep';
import { Step, LoanFormProps } from './loanformcomponents/type';
import { useLoanForm } from './loanformcomponents/useLoanForm';



interface ExtendedLoanFormProps extends LoanFormProps {
  /**
   * Jump the form directly to the 'collateral' step on mount.
   * Used when the applicant already has a saved profile.
   */
  skipToCollateral?: boolean;

  /**
   * When true: hide borrower + kin steps from the progress bar and from rendering.
   * Only Collateral and Review (loan application) are shown.
   */
  hideCompletedSteps?: boolean;
}

// ─── Step lists ───────────────────────────────────────────────────────────────

const ALL_STEPS:     Step[] = ['borrower', 'kin', 'collateral', 'review'];
const PARTIAL_STEPS: Step[] = ['collateral', 'review'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoanForm({
  darkMode,
  onSubmit,
  onCancel,
  userEmail,
  userName,
  skipToCollateral   = false,
  hideCompletedSteps = false,
}: ExtendedLoanFormProps) {

  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    isSubmitting,
    notification,
    calculatedInterest,
    totalRepayment,
    getCurrentInterestRate,
    goToNextStep,
    goBack,
    handleBorrowerSubmit,
    handleKinSubmit,
    handleCollateralSubmit,
    handleFinalSubmit,
    handleIdImageUpload,
    handleCollateralImageUpload,
    removeCollateralImage,
    removeIdImage,
  } = useLoanForm(userEmail, userName, onSubmit);

  // Jump straight to collateral when profile is already complete
  useEffect(() => {
    if (skipToCollateral && (currentStep === 'borrower' || currentStep === 'kin')) {
      setCurrentStep('collateral');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipToCollateral]);

  const visibleSteps = hideCompletedSteps ? PARTIAL_STEPS : ALL_STEPS;
  const stepIndex    = visibleSteps.indexOf(currentStep);
  const stepLabel    = stepIndex >= 0 ? `Step ${stepIndex + 1} of ${visibleSteps.length}` : null;

  const handleStepClick = (step: Step) => {
    // Prevent navigating into hidden steps
    if (hideCompletedSteps && (step === 'borrower' || step === 'kin')) return;
    setCurrentStep(step);
  };

  const handleSkip = () => {
    const next = visibleSteps[stepIndex + 1];
    if (next) setCurrentStep(next);
    else goToNextStep();
  };

  return (
    <>
      {/* Progress bar — only for the visible steps */}
      <ProgressSteps
        currentStep={currentStep}
        steps={visibleSteps}
        onStepClick={handleStepClick}
        darkMode={darkMode}
      />

      {/* Skip button — not shown on review */}
      {currentStep !== 'review' && (
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center"
          >
            Skip this step for now
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}

      <Notification notification={notification} />

      {/* Step content */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border
        ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-6`}>

        {/* Borrower — only in full mode */}
        {!hideCompletedSteps && currentStep === 'borrower' && (
          <BorrowerStep
            darkMode={darkMode}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            userEmail={userEmail}
            onIdImageUpload={handleIdImageUpload}
            onRemoveIdImage={removeIdImage}
            onSubmit={handleBorrowerSubmit}
          />
        )}

        {/* Kin — only in full mode */}
        {!hideCompletedSteps && currentStep === 'kin' && (
          <KinStep
            darkMode={darkMode}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            onBack={goBack}
            onSubmit={handleKinSubmit}
          />
        )}

        {/* Collateral — always rendered (both full and partial mode) */}
        {currentStep === 'collateral' && (
          <CollateralStep
            darkMode={darkMode}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            // ✅ FIXED: Pass empty function instead of undefined
            onBack={hideCompletedSteps ? () => {} : goBack}
            onImageUpload={handleCollateralImageUpload}
            onRemoveImage={removeCollateralImage}
            onSubmit={handleCollateralSubmit}
          />
        )}

        {/* Review / Loan Application — always rendered */}
        {currentStep === 'review' && (
          <ReviewStep
            darkMode={darkMode}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            calculatedInterest={calculatedInterest}
            totalRepayment={totalRepayment}
            getCurrentInterestRate={getCurrentInterestRate}
            userEmail={userEmail}
            onBack={() => setCurrentStep('collateral')}
            onSubmit={handleFinalSubmit}
          />
        )}
      </div>

      {/* Step counter */}
      {stepLabel && (
        <div className="mt-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{stepLabel}</p>
        </div>
      )}
    </>
  );
} 