// app/components/LoanForm/types.ts
export type Step = 'borrower' | 'kin' | 'collateral' | 'review';

export interface FormData {
  dateOfBirth: string;
  nationalId: string;
  borrowerPhone: string;
  alternativePhone: string;
  address: string;
  street: string;
  streetAddress: string;
  city: string;
  frontIdImage: File | null;
  backIdImage: File | null;
  
  // Next of Kin
  kinFullName: string;
  kinPhone: string;
  kinRelationship: string;
  
  // Employment/Income
  occupationName: string;
  businessName: string;
  monthlyIncome: number;
  
  // Collateral
  collateralType: string;
  collateralDescription: string;
  collateralImages: File[];
  
  // Loan Details
  loanAmount: number;
  loanDuration: number;
}

export interface InterestRate {
  min: number;
  max: number;
  rate: number;
}

export interface LoanFormProps {
  darkMode: boolean;
  onSubmit?: (formData: FormData) => void;
  onCancel?: () => void;
  userEmail: string;
  userName?: string;
}

export interface ApiResponse {
  message: string;
  applicationId?: string;
  employment_id?: number;
  profile_id?: number;
  user_id?: number;
  image?: string;
  loan_id?: number;
  collateral_id?: number;
  interest_amount?: number;
  total_repayment?: number;
  error?: string;
}

export interface NotificationType {
  type: 'success' | 'error' | null;
  message: string;
}