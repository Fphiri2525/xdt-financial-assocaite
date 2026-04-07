// app/components/LoanForm/hooks/useCalculations.ts
import { useState, useEffect } from 'react';
import { InterestRate } from'../loanformcomponents/type';

export const useCalculations = (loanAmount: number) => {
  const [calculatedInterest, setCalculatedInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);

  const interestRates: InterestRate[] = [
    { min: 0, max: 9000, rate: 1.3 },
    { min: 10000, max: 90000, rate: 1.2 },
    { min: 110000, max: 140000, rate: 1.1 },
    { min: 150000, max: 200000, rate: 1.05 }
  ];

  useEffect(() => {
    if (loanAmount > 0) {
      const rateConfig = interestRates.find(
        rate => loanAmount >= rate.min && loanAmount <= rate.max
      ) || interestRates[interestRates.length - 1];
      
      const interest = loanAmount * (rateConfig.rate - 1);
      setCalculatedInterest(interest);
      setTotalRepayment(loanAmount + interest);
    } else {
      setCalculatedInterest(0);
      setTotalRepayment(0);
    }
  }, [loanAmount]);

  const getCurrentInterestRate = () => {
    if (!loanAmount || loanAmount <= 0) return '0';
    const rateConfig = interestRates.find(
      rate => loanAmount >= rate.min && loanAmount <= rate.max
    ) || interestRates[interestRates.length - 1];
    return ((rateConfig.rate - 1) * 100).toFixed(1);
  };

  return {
    calculatedInterest,
    totalRepayment,
    getCurrentInterestRate,
    interestRates
  };
};