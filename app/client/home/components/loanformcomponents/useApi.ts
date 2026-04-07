// app/components/LoanForm/hooks/useApi.ts
const API_BASE_URL = 'https://loan-backend-production-558e.up.railway.app';

export const useApi = () => {
  const handleApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      throw new Error(`Server error: ${response.status}`);
    }
  };

  // ─── Borrower ─────────────────────────────────────────────────────────────

  const submitBorrowerData = async (email: string, formData: any) => {
    let profileId = null;

    if (email && formData.dateOfBirth && formData.nationalId && formData.borrowerPhone) {
      const profileResponse = await fetch(`${API_BASE_URL}/api/profile/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          date_of_birth: formData.dateOfBirth,
          national_id: formData.nationalId,
          phone: formData.borrowerPhone,
          alternative_phone: formData.alternativePhone || '',
          city: formData.city || '',
          street: formData.street || '',
          house_number: formData.streetAddress || ''
        })
      });

      if (profileResponse.ok) {
        const result = await handleApiResponse(profileResponse);
        profileId = result.user_id;
      }
    }

    if (formData.frontIdImage && email) {
      const frontFormData = new FormData();
      frontFormData.append('email', email);
      frontFormData.append('image_type', 'front');
      frontFormData.append('image', formData.frontIdImage);
      await fetch(`${API_BASE_URL}/api/id-images/upload`, {
        method: 'POST',
        body: frontFormData
      }).catch(() => {});
    }

    if (formData.backIdImage && email) {
      const backFormData = new FormData();
      backFormData.append('email', email);
      backFormData.append('image_type', 'back');
      backFormData.append('image', formData.backIdImage);
      await fetch(`${API_BASE_URL}/api/id-images/upload`, {
        method: 'POST',
        body: backFormData
      }).catch(() => {});
    }

    return { profileId };
  };

  // ─── Kin & Employment ──────────────────────────────────────────────────────

  const submitKinData = async (email: string, formData: any) => {
    if (email && formData.occupationName && formData.monthlyIncome > 0) {
      await fetch(`${API_BASE_URL}/api/employment/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          occupation: formData.occupationName,
          employer_name: formData.businessName || '',
          monthly_income: formData.monthlyIncome
        })
      }).catch(() => {});
    }

    if (email && formData.kinFullName && formData.kinPhone && formData.kinRelationship) {
      await fetch(`${API_BASE_URL}/api/next-of-kin/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          full_name: formData.kinFullName,
          phone: formData.kinPhone,
          relationship: formData.kinRelationship
        })
      }).catch(() => {});
    }
  };

  // ─── Collateral ───────────────────────────────────────────────────────────

  const submitCollateralData = async (email: string, formData: any) => {
    if (!email || !formData.collateralType) return;

    const collateralResponse = await fetch(`${API_BASE_URL}/api/collateral/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        collateral_type: formData.collateralType,
        description: formData.collateralDescription || ''
      })
    });

    if (!collateralResponse.ok) {
      console.error('Collateral add failed:', await collateralResponse.text());
      return;
    }

    const collateralResult = await handleApiResponse(collateralResponse);
    const collateralId = collateralResult?.data?.collateral_id;

    console.log('collateral_id:', collateralId);

    if (!collateralId) {
      console.error('No collateral_id in response — image upload skipped. Full response:', collateralResult);
      return;
    }

    if (Array.isArray(formData.collateralImages) && formData.collateralImages.length > 0) {
      for (let i = 0; i < formData.collateralImages.length; i++) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.collateralImages[i]);

        const imageResponse = await fetch(
          `${API_BASE_URL}/api/collateral-images/upload/${collateralId}`,
          {
            method: 'POST',
            body: imageFormData
          }
        );

        if (!imageResponse.ok) {
          console.error(`Image ${i + 1} upload failed:`, await imageResponse.text());
        }
      }
    }
  };

  // ─── Send Admin Notification ──────────────────────────────────────────────
  
  const sendAdminNotification = async (userEmail: string, userName: string, loanAmount: number, loanDuration: number, loanId?: number) => {
    try {
      console.log('📧 Sending admin notification...');
      
      const response = await fetch(`${API_BASE_URL}/api/email/admin-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userEmail,
          userName: userName,
          loanAmount: loanAmount,
          loanDuration: loanDuration,
          applicationDate: new Date().toLocaleString(),
          loanId: loanId
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Admin notification sent successfully:', result);
        return true;
      } else {
        console.error('❌ Failed to send admin notification:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('❌ Admin notification error:', error);
      return false;
    }
  };

  // ─── Loan Application with Email Integration ──────────────────────────────

  const submitLoanApplication = async (email: string, formData: any, userName?: string) => {
    const loanAmount = formData.loanAmount || 1000;
    const interestRates = [
      { min: 0,      max: 9000,   rate: 1.3  },
      { min: 10000,  max: 90000,  rate: 1.2  },
      { min: 110000, max: 140000, rate: 1.1  },
      { min: 150000, max: 200000, rate: 1.05 }
    ];

    const rateConfig = interestRates.find(
      rate => loanAmount >= rate.min && loanAmount <= rate.max
    ) || interestRates[0];

    let loanId = null;
    let userEmailSent = false;
    let adminEmailSent = false;

    console.log('📧 Preparing to send emails for logged-in user:', email);

    if (email) {
      // Step 1: Submit loan application
      const loanResponse = await fetch(`${API_BASE_URL}/api/loans/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          loan_amount: loanAmount,
          interest_rate: rateConfig.rate,
          duration_weeks: formData.loanDuration || 1
        })
      });

      if (loanResponse.ok) {
        const result = await handleApiResponse(loanResponse);
        loanId = result.loan_id;

        // Step 2: Send confirmation email to USER
        try {
          const userEmailResponse = await fetch(`${API_BASE_URL}/api/test-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              name: userName || 'Valued Customer'
            })
          });

          if (userEmailResponse.ok) {
            userEmailSent = true;
            console.log('✅ Confirmation email sent to user:', email);
          } else {
            console.error('❌ Failed to send user email');
          }
        } catch (emailError) {
          console.error('❌ User email error:', emailError);
        }

        // Step 3: Send notification to ADMIN
        const adminSent = await sendAdminNotification(
          email,
          userName || 'Customer',
          loanAmount,
          formData.loanDuration || 1,
          loanId
        );
        
        adminEmailSent = adminSent;
      }
    }

    // Customize success message
    let message = userName
      ? `✓ Thank you ${userName}! Your loan application has been submitted.`
      : '✓ Loan application submitted!';

    if (userEmailSent) {
      message += ` A confirmation email has been sent to your email address.`;
    }
    
    if (adminEmailSent) {
      message += ` The admin has been notified.`;
    }

    return { message, loanId, userEmailSent, adminEmailSent };
  };

  return {
    submitBorrowerData,
    submitKinData,
    submitCollateralData,
    submitLoanApplication,
    sendAdminNotification  // Export this if needed separately
  };
};