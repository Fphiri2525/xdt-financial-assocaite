// app/components/LoanForm/components/steps/BorrowerStep.tsx
import React, { useState } from 'react';
import { ChevronRight, IdCard, X, AlertCircle } from 'lucide-react';
import { FormData } from './type';

interface BorrowerStepProps {
  darkMode: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isSubmitting: boolean;
  userEmail: string;
  onIdImageUpload: (type: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveIdImage: (type: 'front' | 'back') => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface ValidationErrors {
  frontIdImage?: string;
  backIdImage?: string;
  dateOfBirth?: string;
  nationalId?: string;
  borrowerPhone?: string;
  alternativePhone?: string;
  city?: string;
  street?: string;
  streetAddress?: string;
}

// Validates Malawian phone numbers: +265/265/0 prefix, then 1/8/9, then 8 more digits
// Accepted formats: +265991234567, 0991234567, 265991234567
const PHONE_REGEX = /^(\+?265|0)[189]\d{8}$/;

// Malawian National ID: 8 alphanumeric characters (adjust to your actual format)
const NATIONAL_ID_REGEX = /^[A-Z0-9]{6,12}$/i;

function validatePhone(value: string): string | undefined {
  if (!value.trim()) return 'Phone number is required';
  const cleaned = value.replace(/[\s\-().]/g, '');
  if (!PHONE_REGEX.test(cleaned)) {
    return 'Enter a valid Malawian number (e.g. +265991234567 or 0991234567)';
  }
}

function validateOptionalPhone(value: string): string | undefined {
  if (!value.trim()) return undefined; // optional field
  const cleaned = value.replace(/[\s\-().]/g, '');
  if (!PHONE_REGEX.test(cleaned)) {
    return 'Enter a valid Malawian number (e.g. +265991234567 or 0991234567)';
  }
}

function validateDateOfBirth(value: string): string | undefined {
  if (!value) return 'Date of birth is required';
  const dob = new Date(value);
  const today = new Date();
  if (isNaN(dob.getTime())) return 'Invalid date';
  const age = today.getFullYear() - dob.getFullYear() -
    (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
  if (age < 18) return 'You must be at least 18 years old';
  if (age > 100) return 'Please enter a valid date of birth';
}

function validateNationalId(value: string): string | undefined {
  if (!value.trim()) return 'National ID number is required';
  if (!NATIONAL_ID_REGEX.test(value.trim())) {
    return 'Enter a valid National ID (8–12 alphanumeric characters)';
  }
}

function validateRequired(value: string, label: string): string | undefined {
  if (!value.trim()) return `${label} is required`;
}

function validateAll(formData: FormData): ValidationErrors {
  return {
    frontIdImage: !formData.frontIdImage ? 'Front of ID card is required' : undefined,
    backIdImage: !formData.backIdImage ? 'Back of ID card is required' : undefined,
    dateOfBirth: validateDateOfBirth(formData.dateOfBirth),
    nationalId: validateNationalId(formData.nationalId),
    borrowerPhone: validatePhone(formData.borrowerPhone),
    alternativePhone: validateOptionalPhone(formData.alternativePhone),
    city: validateRequired(formData.city, 'City'),
    street: validateRequired(formData.street, 'Street'),
    streetAddress: validateRequired(formData.streetAddress, 'House number'),
  };
}

function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export const BorrowerStep: React.FC<BorrowerStepProps> = ({
  darkMode,
  formData,
  setFormData,
  isSubmitting,
  userEmail,
  onIdImageUpload,
  onRemoveIdImage,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const input = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  }`;

  const inputError = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-400 ${
    darkMode
      ? 'bg-gray-700 border-red-500 text-white'
      : 'bg-white border-red-400 text-gray-900'
  }`;

  const label = `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function getFieldClass(field: keyof ValidationErrors) {
    return touched[field] && errors[field] ? inputError : input;
  }

  function ErrorMsg({ field }: { field: keyof ValidationErrors }) {
    if (!touched[field] || !errors[field]) return null;
    return (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} className="shrink-0" />
        {errors[field]}
      </p>
    );
  }

  function handleBlur(field: keyof ValidationErrors, validator: () => string | undefined) {
    touch(field);
    setErrors((prev) => ({ ...prev, [field]: validator() }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allErrors = validateAll(formData);
    // Mark all fields as touched so all errors show
    const allTouched = Object.keys(allErrors).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<string, boolean>
    );
    setErrors(allErrors);
    setTouched(allTouched);
    if (hasErrors(allErrors)) return;
    onSubmit(e);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Personal Details
      </h2>
  
      <div className="space-y-4">
        {/* ID Images Upload */}
        <div className="space-y-4 mb-6">
          {/* Front ID */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Front of ID Card <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 ${
                touched.frontIdImage && errors.frontIdImage
                  ? 'border-red-400'
                  : darkMode
                  ? 'border-gray-600'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  onIdImageUpload('front', e);
                  touch('frontIdImage');
                  setErrors((prev) => ({ ...prev, frontIdImage: undefined }));
                }}
                className="hidden"
                id="front-id"
              />
              <label htmlFor="front-id" className="flex flex-col items-center cursor-pointer">
                <IdCard className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.frontIdImage ? formData.frontIdImage.name : 'Click to upload front of ID'}
                </span>
              </label>
            </div>
            {formData.frontIdImage && (
              <div className="mt-2 relative inline-block">
                <img
                  src={URL.createObjectURL(formData.frontIdImage)}
                  alt="Front ID"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveIdImage('front')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <ErrorMsg field="frontIdImage" />
          </div>

          {/* Back ID */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Back of ID Card <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 ${
                touched.backIdImage && errors.backIdImage
                  ? 'border-red-400'
                  : darkMode
                  ? 'border-gray-600'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  onIdImageUpload('back', e);
                  touch('backIdImage');
                  setErrors((prev) => ({ ...prev, backIdImage: undefined }));
                }}
                className="hidden"
                id="back-id"
              />
              <label htmlFor="back-id" className="flex flex-col items-center cursor-pointer">
                <IdCard className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.backIdImage ? formData.backIdImage.name : 'Click to upload back of ID'}
                </span>
              </label>
            </div>
            {formData.backIdImage && (
              <div className="mt-2 relative inline-block">
                <img
                  src={URL.createObjectURL(formData.backIdImage)}
                  alt="Back ID"
                  className="h-20 w-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveIdImage('back')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <ErrorMsg field="backIdImage" />
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date of Birth */}
          <div>
            <label className={label}>
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                .toISOString()
                .split('T')[0]}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              onBlur={() =>
                handleBlur('dateOfBirth', () => validateDateOfBirth(formData.dateOfBirth))
              }
              className={getFieldClass('dateOfBirth')}
            />
            <ErrorMsg field="dateOfBirth" />
          </div>

          {/* National ID */}
          <div>
            <label className={label}>
              National ID Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nationalId}
              onChange={(e) =>
                setFormData({ ...formData, nationalId: e.target.value.toUpperCase() })
              }
              onBlur={() =>
                handleBlur('nationalId', () => validateNationalId(formData.nationalId))
              }
              placeholder="e.g. AB12345678"
              className={getFieldClass('nationalId')}
            />
            <ErrorMsg field="nationalId" />
          </div>

          {/* Phone Number */}
          <div>
            <label className={label}>
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.borrowerPhone}
              onChange={(e) => setFormData({ ...formData, borrowerPhone: e.target.value })}
              onBlur={() =>
                handleBlur('borrowerPhone', () => validatePhone(formData.borrowerPhone))
              }
              placeholder="+265 991 234 567"
              className={getFieldClass('borrowerPhone')}
            />
            <ErrorMsg field="borrowerPhone" />
          </div>

          {/* Alternative Phone */}
          <div>
            <label className={label}>
              Alternative Phone Number
            </label>
            <input
              type="tel"
              value={formData.alternativePhone}
              onChange={(e) => setFormData({ ...formData, alternativePhone: e.target.value })}
              onBlur={() =>
                handleBlur('alternativePhone', () =>
                  validateOptionalPhone(formData.alternativePhone)
                )
              }
              placeholder="+265 991 234 567 (optional)"
              className={getFieldClass('alternativePhone')}
            />
            <ErrorMsg field="alternativePhone" />
          </div>
        </div>

        {/* Address Information */}
        <div className="mt-6">
          <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label className={label}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                onBlur={() => handleBlur('city', () => validateRequired(formData.city, 'City'))}
                placeholder="City/Town"
                className={getFieldClass('city')}
              />
              <ErrorMsg field="city" />
            </div>

            {/* Street */}
            <div>
              <label className={label}>
                Street <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                onBlur={() =>
                  handleBlur('street', () => validateRequired(formData.street, 'Street'))
                }
                placeholder="Street name"
                className={getFieldClass('street')}
              />
              <ErrorMsg field="street" />
            </div>

            {/* House Number */}
            <div>
              <label className={label}>
                House Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                onBlur={() =>
                  handleBlur('streetAddress', () =>
                    validateRequired(formData.streetAddress, 'House number')
                  )
                }
                placeholder="House/Building number"
                className={getFieldClass('streetAddress')}
              />
              <ErrorMsg field="streetAddress" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
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