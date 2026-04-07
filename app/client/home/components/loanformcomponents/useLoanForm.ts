// app/components/LoanForm/hooks/useLoanForm.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormData, Step, NotificationType } from './type';
import { useCalculations } from './useCalculations';
import { useApi } from './useApi';

export const useLoanForm = (userEmail: string, userName?: string, onSubmit?: (data: FormData) => void) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('borrower');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<NotificationType>({ type: null, message: '' });
  const [profileId, setProfileId] = useState<number | null>(null);
  const [loanId, setLoanId] = useState<number | null>(null);
  const [collateralId, setCollateralId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    dateOfBirth: '',
    nationalId: '',
    borrowerPhone: '',
    alternativePhone: '',
    address: '',
    street: '',
    streetAddress: '',
    city: '',
    frontIdImage: null,
    backIdImage: null,
    
    kinFullName: '',
    kinPhone: '',
    kinRelationship: '',
    
    occupationName: '',
    businessName: '',
    monthlyIncome: 0,
    
    collateralType: '',
    collateralDescription: '',
    collateralImages: [],
    
    loanAmount: 0,
    loanDuration: 1
  });

  const { calculatedInterest, totalRepayment, getCurrentInterestRate } = useCalculations(formData.loanAmount);

  const { submitBorrowerData, submitKinData, submitCollateralData, submitLoanApplication } = useApi();

  // Go to next step
  const goToNextStep = () => {
    if (currentStep === 'borrower') setCurrentStep('kin');
    else if (currentStep === 'kin') setCurrentStep('collateral');
    else if (currentStep === 'collateral') setCurrentStep('review');
  };

  // Go back to previous step
  const goBack = () => {
    if (currentStep === 'kin') setCurrentStep('borrower');
    else if (currentStep === 'collateral') setCurrentStep('kin');
    else if (currentStep === 'review') setCurrentStep('collateral');
  };

  // Direct step navigation (for progress bar clicks)
  const navigateToStep = (step: Step) => {
    setCurrentStep(step);
  };

  // Handle borrower submission
  const handleBorrowerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    try {
      const result = await submitBorrowerData(userEmail, formData);
      if (result.profileId) setProfileId(result.profileId);
      
      setNotification({ type: 'success', message: '✓ Progress saved!' });
      setTimeout(() => {
        setCurrentStep('kin');
        setNotification({ type: null, message: '' });
      }, 1500);
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setCurrentStep('kin'), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle kin submission
  const handleKinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    try {
      await submitKinData(userEmail, formData);
      setNotification({ type: 'success', message: '✓ Progress saved!' });
      setTimeout(() => {
        setCurrentStep('collateral');
        setNotification({ type: null, message: '' });
      }, 1500);
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setCurrentStep('collateral'), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle collateral submission
  const handleCollateralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    try {
      await submitCollateralData(userEmail, formData);
      setNotification({ type: 'success', message: '✓ Progress saved!' });
      setTimeout(() => {
        setCurrentStep('review');
        setNotification({ type: null, message: '' });
      }, 1500);
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      setTimeout(() => setCurrentStep('review'), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle final submission - sends both user and admin emails
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    // Log which user is applying
    console.log('📝 Submitting loan application for logged-in user:', {
      email: userEmail,
      name: userName || 'Not provided',
      loanAmount: formData.loanAmount,
      loanDuration: formData.loanDuration
    });

    try {
      // Submit loan application - automatically sends email to user AND admin
      const result = await submitLoanApplication(userEmail, formData, userName);
      
      // Store loan ID if returned
      if (result.loanId) setLoanId(result.loanId);
      
      // Show success message with email status
      let successMessage = result.message;
      
      if (result.userEmailSent) {
        successMessage += ` ✅ Check your email (${userEmail}) for confirmation.`;
      }
      
      if (result.adminEmailSent) {
        successMessage += ` 📧 Admin has been notified.`;
      }
      
      setNotification({ 
        type: 'success', 
        message: successMessage
      });
      
      // Call optional onSubmit callback
      if (onSubmit) onSubmit(formData);
      
      // Optional: Redirect after 3 seconds
      setTimeout(() => {
        setNotification({ type: null, message: '' });
        // router.push('/dashboard'); // Uncomment to redirect
      }, 5000);
      
    } catch (error: any) {
      console.error('Final submission error:', error);
      setNotification({ 
        type: 'error', 
        message: 'There was an error submitting your application. Please try again.' 
      });
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image handlers
  const handleIdImageUpload = (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'front') {
      setFormData({ ...formData, frontIdImage: files[0] });
    } else {
      setFormData({ ...formData, backIdImage: files[0] });
    }
  };

  const handleCollateralImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files);
    setFormData({ 
      ...formData, 
      collateralImages: [...formData.collateralImages, ...newImages] 
    });
  };

  const removeCollateralImage = (index: number) => {
    const newImages = [...formData.collateralImages];
    newImages.splice(index, 1);
    setFormData({ ...formData, collateralImages: newImages });
  };

  const removeIdImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFormData({ ...formData, frontIdImage: null });
    } else {
      setFormData({ ...formData, backIdImage: null });
    }
  };

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    isSubmitting,
    notification,
    calculatedInterest,
    totalRepayment,
    profileId,
    loanId,
    collateralId,
    goToNextStep,
    goBack,
    navigateToStep,
    handleBorrowerSubmit,
    handleKinSubmit,
    handleCollateralSubmit,
    handleFinalSubmit,
    handleIdImageUpload,
    handleCollateralImageUpload,
    removeCollateralImage,
    removeIdImage,
    getCurrentInterestRate
  };
};