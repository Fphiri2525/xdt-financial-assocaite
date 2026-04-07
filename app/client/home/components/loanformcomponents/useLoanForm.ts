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

  // Handle borrower submission with detailed notifications
  const handleBorrowerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.dateOfBirth || !formData.nationalId || !formData.borrowerPhone) {
      setNotification({ 
        type: 'error', 
        message: '❌ Please fill in all required fields: Date of Birth, National ID, and Phone Number' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Submitting borrower data for email:', userEmail);
      console.log('📦 Borrower data payload:', {
        email: userEmail,
        dateOfBirth: formData.dateOfBirth,
        nationalId: formData.nationalId,
        phone: formData.borrowerPhone,
        alternativePhone: formData.alternativePhone,
        city: formData.city,
        street: formData.street,
        streetAddress: formData.streetAddress
      });

      const result = await submitBorrowerData(userEmail, formData);
      
      console.log('📥 Borrower submission response:', result);
      
      if (result && result.profileId) {
        setProfileId(result.profileId);
        setNotification({ 
          type: 'success', 
          message: '✅ Personal details saved successfully! Your information has been recorded.' 
        });
      } else {
        setNotification({ 
          type: 'success', 
          message: '✅ Personal details saved successfully!' 
        });
      }
      
      // Move to next step after success
      setTimeout(() => {
        setCurrentStep('kin');
        setNotification({ type: null, message: '' });
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Borrower submission error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.status
      });
      
      setNotification({ 
        type: 'error', 
        message: `❌ Error while saving personal details: ${error.message || 'Please check your information and try again.'}` 
      });
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle kin submission with detailed notifications
  const handleKinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.kinFullName || !formData.kinPhone || !formData.kinRelationship) {
      setNotification({ 
        type: 'error', 
        message: '❌ Please fill in all next of kin details: Full Name, Phone Number, and Relationship' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Submitting kin data for email:', userEmail);
      console.log('📦 Kin data payload:', {
        email: userEmail,
        kinFullName: formData.kinFullName,
        kinPhone: formData.kinPhone,
        kinRelationship: formData.kinRelationship,
        occupationName: formData.occupationName,
        businessName: formData.businessName,
        monthlyIncome: formData.monthlyIncome
      });

      await submitKinData(userEmail, formData);
      
      setNotification({ 
        type: 'success', 
        message: '✅ Next of kin and employment details saved successfully!' 
      });
      
      setTimeout(() => {
        setCurrentStep('collateral');
        setNotification({ type: null, message: '' });
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Kin submission error:', error);
      setNotification({ 
        type: 'error', 
        message: `❌ Error while saving next of kin details: ${error.message || 'Please try again.'}` 
      });
      
      setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle collateral submission with detailed notifications
  const handleCollateralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.collateralType) {
      setNotification({ 
        type: 'error', 
        message: '❌ Please select a collateral type before proceeding.' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Submitting collateral data for email:', userEmail);
      console.log('📦 Collateral data payload:', {
        email: userEmail,
        collateralType: formData.collateralType,
        collateralDescription: formData.collateralDescription,
        collateralImagesCount: formData.collateralImages?.length || 0
      });

      // ✅ FIXED: Don't try to get collateralId from result if it doesn't exist
      await submitCollateralData(userEmail, formData);
      
      // Remove the line that tries to access result.collateralId
      // if (result.collateralId) {
      //   setCollateralId(result.collateralId);
      // }
      
      setNotification({ 
        type: 'success', 
        message: '✅ Collateral details saved successfully! You can now review your application.' 
      });
      
      setTimeout(() => {
        setCurrentStep('review');
        setNotification({ type: null, message: '' });
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Collateral submission error:', error);
      setNotification({ 
        type: 'error', 
        message: `❌ Error while saving collateral details: ${error.message || 'Please check your information and try again.'}` 
      });
      
      setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle final submission - sends both user and admin emails
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: '' });
    setIsSubmitting(true);

    // Validate loan amount
    if (formData.loanAmount < 1000) {
      setNotification({ 
        type: 'error', 
        message: '❌ Loan amount must be at least MWK 1,000' 
      });
      setIsSubmitting(false);
      return;
    }

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
      if (result && result.loanId) setLoanId(result.loanId);
      
      // Show success message with email status
      let successMessage = '✅ ' + result.message;
      
      if (result.userEmailSent) {
        successMessage += `\n📧 Check your email (${userEmail}) for confirmation.`;
      }
      
      if (result.adminEmailSent) {
        successMessage += `\n👨‍💼 Admin has been notified.`;
      }
      
      setNotification({ 
        type: 'success', 
        message: successMessage
      });
      
      // Call optional onSubmit callback
      if (onSubmit) onSubmit(formData);
      
      // Clear notification after 8 seconds
      setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 8000);
      
    } catch (error: any) {
      console.error('❌ Final submission error:', error);
      setNotification({ 
        type: 'error', 
        message: `❌ Error submitting your loan application: ${error.message || 'Please try again or contact support.'}` 
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
      setNotification({ type: 'success', message: '✅ Front ID image uploaded successfully!' });
      setTimeout(() => setNotification({ type: null, message: '' }), 3000);
    } else {
      setFormData({ ...formData, backIdImage: files[0] });
      setNotification({ type: 'success', message: '✅ Back ID image uploaded successfully!' });
      setTimeout(() => setNotification({ type: null, message: '' }), 3000);
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
    
    setNotification({ 
      type: 'success', 
      message: `✅ ${newImages.length} collateral image(s) uploaded successfully!` 
    });
    setTimeout(() => setNotification({ type: null, message: '' }), 3000);
  };

  const removeCollateralImage = (index: number) => {
    const newImages = [...formData.collateralImages];
    newImages.splice(index, 1);
    setFormData({ ...formData, collateralImages: newImages });
    setNotification({ type: 'success', message: '✅ Image removed successfully!' });
    setTimeout(() => setNotification({ type: null, message: '' }), 2000);
  };

  const removeIdImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFormData({ ...formData, frontIdImage: null });
      setNotification({ type: 'success', message: '✅ Front ID image removed!' });
    } else {
      setFormData({ ...formData, backIdImage: null });
      setNotification({ type: 'success', message: '✅ Back ID image removed!' });
    }
    setTimeout(() => setNotification({ type: null, message: '' }), 2000);
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