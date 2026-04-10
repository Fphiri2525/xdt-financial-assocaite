// app/components/LoanForm/components/steps/KinStep.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Briefcase, AlertCircle } from 'lucide-react';
import { FormData } from './type';

interface KinStepProps {
  darkMode: boolean;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface ValidationErrors {
  kinFullName?: string;
  kinPhone?: string;
  kinRelationship?: string;
  occupationName?: string;
  businessName?: string;
  monthlyIncome?: string;
}

// Required asterisk helper
const Req = () => <span className="text-red-500 ml-0.5">*</span>;

// Malawian phone: +265/265/0 prefix, then 1/8/9, then 8 more digits
const PHONE_REGEX = /^(\+?265|0)[189]\d{8}$/;

// ── validators ──────────────────────────────────────────────────────────────

function validateKinFullName(value: string): string | undefined {
  if (!value.trim()) return 'Full name is required';
}

function validateKinPhone(value: string): string | undefined {
  if (!value.trim()) return 'Phone number is required';
  const cleaned = value.replace(/[\s\-().]/g, '');
  if (!PHONE_REGEX.test(cleaned))
    return 'Enter a valid Malawian number (e.g. +265991234567 or 0991234567)';
}

function validateKinRelationship(value: string): string | undefined {
  if (!value.trim()) return 'Relationship is required';
}

function validateOccupation(value: string): string | undefined {
  if (!value.trim()) return 'Occupation is required';
}

function validateBusinessName(value: string): string | undefined {
  if (!value.trim()) return 'Business / Employer name is required';
}

function validateMonthlyIncome(value: number | string): string | undefined {
  if (value === '' || value === null || value === undefined) return 'Monthly income is required';
  const num = Number(value);
  if (isNaN(num)) return 'Enter a valid number';
  if (num < 0) return 'Income cannot be negative';
  if (num > 100_000_000) return 'Please enter a realistic income amount';
}

function validateAll(formData: FormData): ValidationErrors {
  return {
    kinFullName: validateKinFullName(formData.kinFullName ?? ''),
    kinPhone: validateKinPhone(formData.kinPhone ?? ''),
    kinRelationship: validateKinRelationship(formData.kinRelationship ?? ''),
    occupationName: validateOccupation(formData.occupationName ?? ''),
    businessName: validateBusinessName(formData.businessName ?? ''),
    monthlyIncome: validateMonthlyIncome(formData.monthlyIncome),
  };
}

function hasErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some(Boolean);
}

// ── component ────────────────────────────────────────────────────────────────

export const KinStep: React.FC<KinStepProps> = ({
  darkMode,
  formData,
  setFormData,
  isSubmitting,
  onBack,
  onSubmit,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ── shared style helpers ──
  const baseInput = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
  }`;

  const errorInput = `w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-400 ${
    darkMode ? 'bg-gray-600 border-red-500 text-white' : 'bg-white border-red-400 text-gray-900'
  }`;

  const labelClass = `block text-sm font-medium mb-1 ${
    darkMode ? 'text-gray-300' : 'text-gray-700'
  }`;

  function fieldClass(field: keyof ValidationErrors) {
    return touched[field] && errors[field] ? errorInput : baseInput;
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

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleBlur<K extends keyof ValidationErrors>(
    field: K,
    validator: () => string | undefined
  ) {
    touch(field);
    setErrors((prev) => ({ ...prev, [field]: validator() }));
  }

  // Re-validate a single field on change once it has been touched
  function revalidateField<K extends keyof ValidationErrors>(
    field: K,
    validator: () => string | undefined
  ) {
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validator() }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allErrors = validateAll(formData);
    setErrors(allErrors);
    setTouched(
      Object.keys(allErrors).reduce(
        (acc, k) => ({ ...acc, [k]: true }),
        {} as Record<string, boolean>
      )
    );
    if (hasErrors(allErrors)) return;
    onSubmit(e);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Next of Kin & Employment Details
      </h2>

      <div className="space-y-6">
        {/* ── Next of Kin ── */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3
            className={`font-semibold mb-4 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <User size={18} className="mr-2" />
            Next of Kin
          </h3>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name <Req /></label>
              <input
                type="text"
                value={formData.kinFullName ?? ''}
                onChange={(e) => {
                  const updated = { ...formData, kinFullName: e.target.value };
                  setFormData(updated);
                  revalidateField('kinFullName', () => validateKinFullName(e.target.value));
                }}
                onBlur={() =>
                  handleBlur('kinFullName', () =>
                    validateKinFullName(formData.kinFullName ?? '')
                  )
                }
                placeholder="e.g. John Banda"
                className={fieldClass('kinFullName')}
              />
              <ErrorMsg field="kinFullName" />
            </div>

            {/* Kin Phone */}
            <div>
              <label className={labelClass}>Phone Number <Req /></label>
              <input
                type="tel"
                value={formData.kinPhone ?? ''}
                onChange={(e) => {
                  const updated = { ...formData, kinPhone: e.target.value };
                  setFormData(updated);
                  revalidateField('kinPhone', () => validateKinPhone(e.target.value));
                }}
                onBlur={() =>
                  handleBlur('kinPhone', () =>
                    validateKinPhone(formData.kinPhone ?? '')
                  )
                }
                placeholder="+265 991 234 567"
                className={fieldClass('kinPhone')}
              />
              <ErrorMsg field="kinPhone" />
            </div>

            {/* Relationship */}
            <div>
              <label className={labelClass}>Relationship <Req /></label>
              <input
                type="text"
                value={formData.kinRelationship ?? ''}
                onChange={(e) => {
                  const updated = { ...formData, kinRelationship: e.target.value };
                  setFormData(updated);
                  revalidateField('kinRelationship', () => validateKinRelationship(e.target.value));
                }}
                onBlur={() =>
                  handleBlur('kinRelationship', () =>
                    validateKinRelationship(formData.kinRelationship ?? '')
                  )
                }
                placeholder="e.g. Spouse, Parent, Sibling"
                className={fieldClass('kinRelationship')}
              />
              <ErrorMsg field="kinRelationship" />
            </div>
          </div>
        </div>

        {/* ── Employment ── */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3
            className={`font-semibold mb-4 flex items-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <Briefcase size={18} className="mr-2" />
            Employment Information
          </h3>

          <div className="space-y-4">
            {/* Occupation */}
            <div>
              <label className={labelClass}>Occupation / Job Title <Req /></label>
              <input
                type="text"
                value={formData.occupationName ?? ''}
                onChange={(e) => {
                  setFormData({ ...formData, occupationName: e.target.value });
                  revalidateField('occupationName', () => validateOccupation(e.target.value));
                }}
                onBlur={() =>
                  handleBlur('occupationName', () =>
                    validateOccupation(formData.occupationName ?? '')
                  )
                }
                placeholder="e.g. Teacher, Trader, Engineer"
                className={fieldClass('occupationName')}
              />
              <ErrorMsg field="occupationName" />
            </div>

            {/* Business / Employer Name */}
            <div>
              <label className={labelClass}>Business / Employer Name <Req /></label>
              <input
                type="text"
                value={formData.businessName ?? ''}
                onChange={(e) => {
                  setFormData({ ...formData, businessName: e.target.value });
                  revalidateField('businessName', () => validateBusinessName(e.target.value));
                }}
                onBlur={() =>
                  handleBlur('businessName', () =>
                    validateBusinessName(formData.businessName ?? '')
                  )
                }
                placeholder="e.g. Malawi Revenue Authority"
                className={fieldClass('businessName')}
              />
              <ErrorMsg field="businessName" />
            </div>

            {/* Monthly Income */}
            <div>
              <label className={labelClass}>Monthly Income (K) <Req /></label>
              <input
                type="number"
                min="0"
                value={formData.monthlyIncome ?? ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value);
                  setFormData({ ...formData, monthlyIncome: val } as FormData);
                  revalidateField('monthlyIncome', () => validateMonthlyIncome(val));
                }}
                onBlur={() =>
                  handleBlur('monthlyIncome', () => validateMonthlyIncome(formData.monthlyIncome))
                }
                placeholder="e.g. 150000"
                className={fieldClass('monthlyIncome')}
              />
              <ErrorMsg field="monthlyIncome" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition flex items-center"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back
        </button>

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