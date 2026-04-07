// app/components/LoanForm/hooks/useApi.ts
const API_BASE_URL = 'https://loan-backend-production-558e.up.railway.app';

export const useApi = () => {
  const handleApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('📥 API Response:', { status: response.status, data });
      return data;
    } else {
      const text = await response.text();
      console.error('❌ Non-JSON response:', text);
      throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
    }
  };

  // ─── Get Profile ID by Email ──────────────────────────────────────────────
  
  const getProfileIdByEmail = async (email: string): Promise<number | null> => {
    try {
      console.log('🔍 Getting profile for email:', email);
      const response = await fetch(`${API_BASE_URL}/api/profile/get?email=${email}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.profile?.profile_id || data.data?.profile_id || null;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting profile:', error);
      return null;
    }
  };

  // ─── BORROWER DATA - Using /api/profile/create ───────────────────────────

  const submitBorrowerData = async (email: string, formData: any) => {
    let profileId = null;
    console.log('🚀 Starting submitBorrowerData for email:', email);

    try {
      if (email && formData.dateOfBirth && formData.nationalId && formData.borrowerPhone) {
        console.log('📤 Creating profile with data:', {
          email: email,
          date_of_birth: formData.dateOfBirth,
          national_id: formData.nationalId,
          phone: formData.borrowerPhone,
          alternative_phone: formData.alternativePhone || '',
          city: formData.city || '',
          street: formData.street || '',
          house_number: formData.streetAddress || ''
        });

        // Try to create profile
        let profileResponse = await fetch(`${API_BASE_URL}/api/profile/create`, {
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

        // If profile exists (error), try update instead
        if (!profileResponse.ok && profileResponse.status === 500) {
          console.log('📤 Profile might exist, trying to update...');
          profileResponse = await fetch(`${API_BASE_URL}/api/profile/update`, {
            method: 'PUT',
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
        }

        if (!profileResponse.ok) {
          const errorText = await profileResponse.text();
          console.error('❌ Profile API error:', errorText);
          throw new Error(`Profile API returned ${profileResponse.status}`);
        }

        const result = await handleApiResponse(profileResponse);
        console.log('✅ Profile API success:', result);
        
        // Get profile_id after creation
        profileId = await getProfileIdByEmail(email);
        console.log('✅ Retrieved profile_id:', profileId);
      }

      // Upload front ID image
      if (formData.frontIdImage && email) {
        console.log('📸 Uploading front ID image...');
        const frontFormData = new FormData();
        frontFormData.append('email', email);
        frontFormData.append('image_type', 'front');
        frontFormData.append('image', formData.frontIdImage);
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/id-images/upload`, {
            method: 'POST',
            body: frontFormData
          });
          if (response.ok) {
            console.log('✅ Front ID uploaded successfully');
          } else {
            console.error('❌ Front ID upload failed:', await response.text());
          }
        } catch (error) {
          console.error('❌ Front ID upload error:', error);
        }
      }

      // Upload back ID image
      if (formData.backIdImage && email) {
        console.log('📸 Uploading back ID image...');
        const backFormData = new FormData();
        backFormData.append('email', email);
        backFormData.append('image_type', 'back');
        backFormData.append('image', formData.backIdImage);
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/id-images/upload`, {
            method: 'POST',
            body: backFormData
          });
          if (response.ok) {
            console.log('✅ Back ID uploaded successfully');
          } else {
            console.error('❌ Back ID upload failed:', await response.text());
          }
        } catch (error) {
          console.error('❌ Back ID upload error:', error);
        }
      }

    } catch (error) {
      console.error('❌ submitBorrowerData error:', error);
      throw error;
    }

    return { profileId };
  };

  // ─── KIN & EMPLOYMENT DATA ───────────────────────────────────────────────

  const submitKinData = async (email: string, formData: any) => {
    console.log('🚀 Starting submitKinData for email:', email);
    
    try {
      // Note: Employment endpoints are not in your code. You may need to add them.
      // For now, we'll skip employment and only do next of kin.
      
      // Submit next of kin data using /api/next-of-kin/add
      if (formData.kinFullName && formData.kinPhone && formData.kinRelationship) {
        console.log('📤 Submitting next of kin data:', {
          email: email,
          full_name: formData.kinFullName,
          phone: formData.kinPhone,
          relationship: formData.kinRelationship
        });
        
        const response = await fetch(`${API_BASE_URL}/api/next-of-kin/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            full_name: formData.kinFullName,
            phone: formData.kinPhone,
            relationship: formData.kinRelationship
          })
        });
        
        if (!response.ok) {
          console.error('❌ Next of kin API error:', await response.text());
        } else {
          console.log('✅ Next of kin data saved successfully');
        }
      }
    } catch (error) {
      console.error('❌ submitKinData error:', error);
      throw error;
    }
  };

  // ─── COLLATERAL DATA - Using /api/collateral/add ─────────────────────────

  const submitCollateralData = async (email: string, formData: any) => {
    console.log('🚀 Starting submitCollateralData for email:', email);
    
    if (!email || !formData.collateralType) {
      console.warn('⚠️ Missing email or collateral type');
      return;
    }

    try {
      // Add collateral using /api/collateral/add
      console.log('📤 Submitting collateral data:', {
        email: email,
        collateral_type: formData.collateralType,
        description: formData.collateralDescription || ''
      });
      
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
        const errorText = await collateralResponse.text();
        console.error('❌ Collateral add failed:', errorText);
        throw new Error(`Collateral API error: ${collateralResponse.status}`);
      }

      const collateralResult = await handleApiResponse(collateralResponse);
      console.log('✅ Collateral API response:', collateralResult);
      
      const collateralId = collateralResult.data?.collateral_id || collateralResult.collateral_id;
      console.log('📝 collateral_id:', collateralId);

      // Upload collateral images if we have a collateral_id
      if (collateralId && Array.isArray(formData.collateralImages) && formData.collateralImages.length > 0) {
        console.log(`📸 Uploading ${formData.collateralImages.length} collateral images...`);
        
        for (let i = 0; i < formData.collateralImages.length; i++) {
          const imageFormData = new FormData();
          imageFormData.append('image', formData.collateralImages[i]);

          try {
            const imageResponse = await fetch(
              `${API_BASE_URL}/api/collateral-images/upload/${collateralId}`,
              {
                method: 'POST',
                body: imageFormData
              }
            );

            if (!imageResponse.ok) {
              console.error(`❌ Image ${i + 1} upload failed:`, await imageResponse.text());
            } else {
              console.log(`✅ Image ${i + 1} uploaded successfully`);
            }
          } catch (error) {
            console.error(`❌ Image ${i + 1} upload error:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ submitCollateralData error:', error);
      throw error;
    }
  };

  // ─── SEND ADMIN NOTIFICATION ─────────────────────────────────────────────
  
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

  // ─── LOAN APPLICATION - Using /api/loans/apply ───────────────────────────

  const submitLoanApplication = async (email: string, formData: any, userName?: string) => {
    const loanAmount = formData.loanAmount || 1000;
    const durationWeeks = formData.loanDuration || 1;
    
    // Calculate interest rate based on loan amount
    let interestRate = 15; // default
    if (loanAmount <= 9000) interestRate = 1.3;
    else if (loanAmount <= 90000) interestRate = 1.2;
    else if (loanAmount <= 140000) interestRate = 1.1;
    else if (loanAmount <= 200000) interestRate = 1.05;

    let loanId = null;
    let adminEmailSent = false;

    console.log('📝 Submitting loan application for email:', email);
    console.log('📝 Loan details:', { loanAmount, interestRate, durationWeeks });

    try {
      if (!email) {
        throw new Error('Email is required to submit a loan application');
      }

      const loanResponse = await fetch(`${API_BASE_URL}/api/loans/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          loan_amount: loanAmount,
          interest_rate: interestRate,
          duration_weeks: durationWeeks
        })
      });

      if (!loanResponse.ok) {
        const errorText = await loanResponse.text();
        console.error('❌ Loan API Error:', errorText);
        
        let errorMessage = `Loan application failed: ${loanResponse.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await loanResponse.json();
      console.log('✅ Loan application successful:', result);
      
      loanId = result.loan_id || result.data?.loan_id;
      
      // Send admin notification
      try {
        adminEmailSent = await sendAdminNotification(
          email,
          userName || 'Customer',
          loanAmount,
          durationWeeks,
          loanId
        );
      } catch (emailError) {
        console.warn('⚠️ Admin notification failed:', emailError);
      }

    } catch (error) {
      console.error('❌ submitLoanApplication error:', error);
      throw error;
    }

    const message = userName
      ? `✓ Thank you ${userName}! Your loan application has been submitted successfully.`
      : '✓ Loan application submitted successfully!';

    return { message, loanId, userEmailSent: false, adminEmailSent };
  };

  return {
    submitBorrowerData,
    submitKinData,
    submitCollateralData,
    submitLoanApplication,
    sendAdminNotification
  };
};