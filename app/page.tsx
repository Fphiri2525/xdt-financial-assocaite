"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [visibleSection, setVisibleSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".scroll-section");
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7) {
          setVisibleSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loan Calculator States
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

  const handleApplyNow = () => {
    router.push("/admin/login");
  };

  // Collateral items with names
  const collateralItems = [
    { name: "Laptop", image: "/laptop.jpeg" },
    { name: "Smart Phone", image: "/smart phone.avif" },
    { name: "Camera", image: "/camera.jpg" },
    { name: "Projector", image: "/projector.jpeg" },
    { name: "Speaker", image: "/speaker.jpeg" },
    { name: "Microwave", image: "/microwave.jpeg" },
    { name: "Electric Iron", image: "/iron.jpeg" },
    { name: "Electric Kettle", image: "/kettle.jpeg" },
  ];

  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="h-screen relative flex items-center justify-center text-white">
        <Image
          src="/hero.jpg"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            XDT Loan & Mobile Banking Services
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Fast, secure and transparent collateral-based loan services.
            We also provide reliable mobile banking services to help you
            access money anytime.
          </p>
          <button
            onClick={handleApplyNow}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="scroll-section py-32">
        <div
          className={`max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 
        ${
          visibleSection >= 0
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
        >
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src="/about.jpg"
              alt="About XDT"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-6">About XDT</h2>
            <p className="text-lg leading-relaxed mb-6">
              XDT is a trusted financial service company offering
              collateral-based loan services and mobile banking solutions. Our
              mission is to provide fast financial support using valuable
              household and electronic items as security.
            </p>
            <p className="text-lg leading-relaxed">
              Founded by <span className="font-semibold">Robert Mwase</span>,
              XDT is committed to making financial access simple, secure and
              accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* COLLATERALS SECTION - IMPROVED WITH TIGHTER SPACING */}
      <section className="scroll-section py-16 border-t">
        <div
          className={`max-w-7xl mx-auto px-6 transition-all duration-1000 
        ${
          visibleSection >= 1
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
        >
          {/* Header with reduced spacing */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Accepted Collaterals
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              We accept a wide range of high-value portable items as collateral for your loans. 
              From electronics to kitchen appliances, your valuable assets can help you access 
              quick financial assistance.
            </p>
          </div>

          {/* Collateral Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collateralItems.map((item, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                  <h3 className="text-white text-lg font-semibold">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* View More Link */}
          <div className="text-center mt-10">
            <button className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
              View All Collaterals
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* LOAN REQUIREMENTS */}
      <section className="scroll-section py-16 border-t">
        <div
          className={`max-w-6xl mx-auto px-6 transition-all duration-1000 
        ${
          visibleSection >= 2
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Loan Requirements
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              Quick and simple requirements to get your loan approved
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-lg text-center">
            <div className="p-8 border rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold mb-4">Collateral</h3>
              <p>Valuable electronic or household item used as security.</p>
            </div>

            <div className="p-8 border rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold mb-4">National ID</h3>
              <p>Valid Malawi National ID required for verification.</p>
            </div>

            <div className="p-8 border rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-semibold mb-4">Witness</h3>
              <p>A trusted witness with valid identification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTEREST RATES */}
      <section className="scroll-section py-16 border-t text-center">
        <div
          className={`max-w-4xl mx-auto px-6 transition-all duration-1000 
        ${
          visibleSection >= 3
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Daily Interest Rates
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              Competitive rates based on your loan amount
            </p>
          </div>

          <div className="space-y-4 text-lg">
            <p className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <span>5,000 – 9,000 MWK</span>
              <strong className="text-blue-600">1.3% per day</strong>
            </p>
            <p className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <span>10,000 – 90,000 MWK</span>
              <strong className="text-blue-600">1.2% per day</strong>
            </p>
            <p className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <span>100,000 – 140,000 MWK</span>
              <strong className="text-blue-600">1.1% per day</strong>
            </p>
            <p className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
              <span>150,000 – 200,000 MWK</span>
              <strong className="text-blue-600">1.05% per day</strong>
            </p>
          </div>
        </div>
      </section>

      {/* LOAN CALCULATOR */}
      <section className="scroll-section py-16 border-t text-center">
        <div
          className={`max-w-3xl mx-auto px-6 transition-all duration-1000 
        ${
          visibleSection >= 4
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
        >
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Loan Calculator
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              Calculate your total repayment amount
            </p>
          </div>

          <div className="bg-white border rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <input
                type="number"
                placeholder="Enter Loan Amount (MWK)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />

              <input
                type="number"
                placeholder="Enter Number of Days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full p-4 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />

              <button
                onClick={calculateLoan}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Calculate
              </button>

              {result && (
                <div className="mt-6 p-6 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-800">
                    Total Amount: MWK {result.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}