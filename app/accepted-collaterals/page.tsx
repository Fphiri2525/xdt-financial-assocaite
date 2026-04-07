"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  BanknotesIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  BoltIcon,
  PhoneIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ArrowRightIcon,
  UserIcon,
  BriefcaseIcon,
  BoltIcon as EmergencyIcon,
  BuildingOfficeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function LoanPage() {
  const [amount, setAmount] = useState("");
  const [days, setDays] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateLoan = () => {
    const loanAmount = parseFloat(amount);
    const loanDays = parseFloat(days);

    if (!loanAmount || !loanDays) return;

    let rate = 0;

    if (loanAmount >= 5000 && loanAmount <= 9000) rate = 0.013;
    else if (loanAmount >= 10000 && loanAmount <= 90000) rate = 0.012;
    else if (loanAmount >= 100000 && loanAmount <= 140000) rate = 0.011;
    else if (loanAmount >= 150000 && loanAmount <= 200000) rate = 0.0105;

    const interest = loanAmount * rate * loanDays;
    const total = loanAmount + interest;

    setResult(total);
  };

  const loanTypes = [
    {
      title: "Personal Loans",
      description: "Quick cash for emergencies, school fees, and personal needs.",
      amount: "5,000 - 50,000 MWK",
      interest: "1.3% daily",
      icon: UserIcon
    },
    {
      title: "Small Business Loans",
      description: "Working capital for micro-enterprises and small shops.",
      amount: "10,000 - 100,000 MWK",
      interest: "1.2% daily",
      icon: BriefcaseIcon
    },
    {
      title: "Emergency Loans",
      description: "Immediate funds for urgent situations with same-day approval.",
      amount: "5,000 - 30,000 MWK",
      interest: "1.3% daily",
      icon: EmergencyIcon
    },
    {
      title: "Asset-Backed Loans",
      description: "Larger amounts secured by electronics or appliances.",
      amount: "20,000 - 200,000 MWK",
      interest: "1.1% daily",
      icon: BuildingOfficeIcon
    }
  ];

  const loanFeatures = [
    {
      icon: BoltIcon,
      title: "Fast Approval",
      description: "Get approved within 24 hours of application"
    },
    {
      icon: ClockIcon,
      title: "Flexible Terms",
      description: "Choose repayment from 7 to 90 days"
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Process",
      description: "Your assets and data are fully protected"
    },
    {
      icon: BanknotesIcon,
      title: "Low Rates",
      description: "Starting from as low as 1.0% daily interest"
    },
    {
      icon: DocumentTextIcon,
      title: "Minimal Paperwork",
      description: "Simple application with basic requirements"
    },
    {
      icon: PhoneIcon,
      title: "Mobile Money",
      description: "Quick disbursement to your mobile money"
    }
  ];

  const collateralItems = [
    { name: "Laptops", image: "/laptop.jpeg", value: "Up to 150,000 MWK" },
    { name: "Smartphones", image: "/smart phone.avif", value: "Up to 100,000 MWK" },
    { name: "Cameras", image: "/camera.jpg", value: "Up to 120,000 MWK" },
    { name: "Smartwatches", image: "/smart.jpeg", value: "Up to 50,000 MWK" },
    { name: "Projectors", image: "/projector.jpeg", value: "Up to 80,000 MWK" },
    { name: "Speakers", image: "/speaker.jpeg", value: "Up to 40,000 MWK" },
    { name: "Microwaves", image: "/microwave.jpeg", value: "Up to 30,000 MWK" },
    { name: "Electric Irons", image: "/iron.jpeg", value: "Up to 15,000 MWK" },
    { name: "Electric Kettles", image: "/kettle.jpeg", value: "Up to 10,000 MWK" }
  ];

  const steps = [
    {
      number: "01",
      title: "Choose Item",
      description: "Select any acceptable collateral item from our list"
    },
    {
      number: "02",
      title: "Apply Online",
      description: "Fill out our simple application form with your details"
    },
    {
      number: "03",
      title: "Quick Assessment",
      description: "We verify and value your item within hours"
    },
    {
      number: "04",
      title: "Get Cash",
      description: "Money sent to your mobile money account same day"
    }
  ];

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden group">
        <Image
          src="/hero2.jpg"
          alt="Loan Services"
          fill
          className="object-cover transition-all duration-1000 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-700"></div>
        
        <div className="relative text-center px-6 max-w-4xl transform transition-all duration-700 group-hover:translate-y-[-10px] group-hover:scale-105">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg transition-all duration-700 group-hover:translate-x-2">
            Small Loans, Big Opportunities
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md transition-all duration-700 delay-100 group-hover:translate-x-[-5px]">
            Get up to 200,000 MWK using your valuable items as collateral
          </p>
          <div className="w-24 h-0.5 bg-white mx-auto mt-6 transition-all duration-700 delay-200 group-hover:w-48"></div>
          <div className="flex gap-4 justify-center mt-8">
            <Link 
              href="#apply"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 hover:-translate-y-1 shadow-lg"
            >
              Apply Now
            </Link>
            <Link 
              href="#calculator"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/30 transition-all transform hover:scale-105 hover:-translate-y-1"
            >
              Calculate Loan
            </Link>
          </div>
        </div>
      </section>

      {/* LOAN TYPES SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loans We Offer</h2>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Small loans tailored to your needs (Max 200,000 MWK)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanTypes.map((loan, index) => {
              const IconComponent = loan.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-2 text-center"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{loan.title}</h3>
                  <p className="text-sm text-gray-600 text-justify mb-4">{loan.description}</p>
                  <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                    <p className="font-semibold text-gray-700">
                      Amount: <span className="text-blue-600 font-bold">{loan.amount}</span>
                    </p>
                    <p className="font-semibold text-gray-700">
                      Interest: <span className="text-blue-600 font-bold">{loan.interest}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOAN FEATURES SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose XDT Loans</h2>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Simple, transparent, and designed for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm flex items-start gap-4 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600 text-justify">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCEPTED COLLATERALS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Accepted Collaterals</h2>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Use your valuable items to secure a loan
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {collateralItems.map((item, index) => (
              <div 
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 text-center">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-xs text-blue-600 font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link 
              href="/accepted-collaterals"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
            >
              <span>View All Items</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Get your loan in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-center">
                  <span className="text-4xl font-black text-gray-200 mb-3 block">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 text-justify">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRightIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOAN CALCULATOR SECTION */}
      <section id="calculator" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-50 rounded-2xl shadow-md p-8">
            <div className="text-center mb-8">
              <CalculatorIcon className="w-12 h-12 mx-auto mb-4 text-gray-700" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Loan Calculator</h2>
              <div className="w-20 h-0.5 bg-gray-300 mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (MWK)</label>
                <input
                  type="number"
                  placeholder="e.g., 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-300 outline-none"
                />
                <p className="text-xs mt-2 text-gray-500">Max: 200,000 MWK</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Days</label>
                <input
                  type="number"
                  placeholder="e.g., 30"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-300 outline-none"
                />
                <p className="text-xs mt-2 text-gray-500">Max: 90 days</p>
              </div>
            </div>

            <button
              onClick={calculateLoan}
              className="w-full mt-6 bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
            >
              Calculate Repayment
            </button>

            {result && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-center">
                  <span className="text-sm text-gray-600">Total Repayment:</span>
                  <br />
                  <span className="text-3xl font-bold text-gray-900">MWK {result.toFixed(2)}</span>
                </p>
                <p className="text-xs text-center mt-2 text-gray-500">
                  Interest calculated at daily rate based on amount
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Apply?</h2>
          <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 mb-8">
            Get the funds you need today. Quick approval and disbursement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/apply"
              className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
            >
              Apply Now
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}