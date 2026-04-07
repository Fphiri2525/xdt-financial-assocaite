"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ClockIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Call or WhatsApp",
      details: ["+265 998 843 651", "+265 983 170 685"],
      description: "Available 8AM - 5PM, Monday to Saturday"
    },
    {
      icon: EnvelopeIcon,
      title: "Email Us",
      details: ["info@xtdata.mw", "support@xtdata.mw"],
      description: "We respond within 24 hours"
    },
    {
      icon: MapPinIcon,
      title: "Visit Our Office",
      details: ["Area 18, Lilongwe", "Opposite Gateway Mall"],
      description: "Malawi"
    },
    {
      icon: ClockIcon,
      title: "Business Hours",
      details: ["Mon-Fri: 8:00 AM - 5:00 PM", "Sat: 9:00 AM - 1:00 PM"],
      description: "Closed on Sundays & Public Holidays"
    }
  ];

  const paymentDetails = {
    banks: [
      { name: "National Bank", accountName: "Robert Mwase", accountNumber: "1008203098" },
      { name: "FDH Bank", accountName: "Robert Mwase", accountNumber: "140000628157" },
      { name: "First Capital Bank", accountName: "Robert Mwase", accountNumber: "0004503119692" },
      { name: "Standard Bank", accountName: "Robert Mwase", accountNumber: "9100008634197" }
    ],
    mobileMoney: [
      { provider: "Airtel Money Agent", code: "885584" },
      { provider: "TNM Mpamba Agent 1", code: "140547" },
      { provider: "TNM Mpamba Agent 2", code: "2001542" }
    ]
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION with hero.jpg */}
      <section className="relative h-[400px] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Contact AR Automation"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Contact AR Automation
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow-md">
            Reach out for loan inquiries, payment clarifications, or any assistance
          </p>
          <div className="w-24 h-0.5 bg-white mx-auto mt-6"></div>
        </div>
      </section>

      {/* FRAUD WARNING - Prominent Notice */}
      <section className="py-6 bg-red-50 border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-red-700 mb-1">⚠️ IMPORTANT FRAUD WARNING</h3>
              <p className="text-sm text-red-600">
                Only use the official payment details listed on this website. We will NEVER ask you to send money to personal accounts, 
                unlisted numbers, or through unauthorized agents. If you receive any suspicious communication, please report it to us immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT INFORMATION CARDS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              We're here to help with any questions about our loan services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-all text-center"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <item.icon className="w-7 h-7 text-gray-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                {item.details.map((detail, i) => (
                  <p key={i} className="text-sm text-gray-700 font-medium">{detail}</p>
                ))}
                <p className="text-xs text-gray-500 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM AND PAYMENT DETAILS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
              <div className="w-16 h-0.5 bg-gray-300 mb-6"></div>
              <p className="text-sm text-gray-600 mb-6">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm flex items-center gap-2">
                    <CheckBadgeIcon className="w-5 h-5" />
                    Thank you for your message. We'll contact you soon!
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-300 outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-300 outline-none"
                    placeholder="0998 843 651"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll use this to contact you via call or WhatsApp
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 focus:ring-2 focus:ring-gray-300 outline-none resize-none"
                    placeholder="How can we help you? Please include loan amount and collateral type if applicable..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Official Payment Channels</h3>
                <div className="w-16 h-0.5 bg-gray-300 mb-6"></div>
                
                {/* Bank Accounts */}
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BanknotesIcon className="w-5 h-5" />
                    Bank Accounts
                  </h4>
                  <div className="space-y-3">
                    {paymentDetails.banks.map((bank, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                        <p className="font-semibold text-gray-900">{bank.name}</p>
                        <p className="text-gray-600">Account Name: {bank.accountName}</p>
                        <p className="text-gray-600 font-mono">Account: {bank.accountNumber}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Money */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5" />
                    Mobile Money
                  </h4>
                  <div className="space-y-3">
                    {paymentDetails.mobileMoney.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                        <p className="font-semibold text-gray-900">{item.provider}</p>
                        <p className="text-gray-600 font-mono">Agent Code: {item.code}</p>
                      </div>
                    ))}
                    <div className="bg-blue-50 p-3 rounded-lg text-sm border border-blue-100 mt-2">
                      <p className="font-semibold text-gray-900">Airtel Dealer Numbers</p>
                      <p className="text-gray-600 font-mono">0998 843 651</p>
                      <p className="text-gray-600 font-mono">0983 170 685</p>
                      <p className="text-xs text-gray-500 mt-1">Available for calls and WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Reminder */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <CheckBadgeIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">📸 After Payment</h4>
                    <p className="text-sm text-gray-700">
                      After making any payment, please send us a screenshot or transaction reference 
                      via WhatsApp or SMS to <span className="font-bold">0998 843 651</span> or <span className="font-bold">0983 170 685</span>. 
                      This helps us process your loan faster.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRAUD PREVENTION SECTION */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ShieldCheckIcon className="w-16 h-16 mx-auto mb-4 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Stay Safe from Fraud</h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-6"></div>
          <p className="text-gray-600 mb-4">
            AR Automation will NEVER ask you to send money to personal accounts, unknown mobile numbers, 
            or through unauthorized agents. All payments must be made ONLY to the official accounts listed above.
          </p>
          <div className="bg-red-50 p-4 rounded-lg inline-block">
            <p className="text-sm text-red-700 font-medium flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5" />
              If you're unsure about any payment request, contact us immediately
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER - Professional footer with all information */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">AR Automation</h3>
              <p className="text-sm leading-relaxed">
                Trusted loan services in Lilongwe, Malawi. Fast, secure, and transparent collateral-based loans.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/loans" className="hover:text-white transition-colors">Loan Services</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li>📞 0998 843 651</li>
                <li>📞 0983 170 685</li>
                <li>✉️ info@xtdata.mw</li>
                <li>📍 Area 18, Lilongwe</li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Business Hours</h3>
              <ul className="space-y-2 text-sm">
                <li>Mon-Fri: 8AM - 5PM</li>
                <li>Saturday: 9AM - 1PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>

          {/* Anti-Fraud Disclaimer */}
          <div className="border-t border-gray-800 pt-6 mt-6">
            <div className="bg-red-900/20 p-4 rounded-lg mb-4">
              <p className="text-sm text-red-400 flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-red-300">ANTI-FRAUD DISCLAIMER:</strong> AR Automation maintains ONLY the official payment channels listed on this website. 
                  We do not have agents, representatives, or third parties collecting payments on our behalf. 
                  Any request for payment to personal accounts, unknown mobile numbers, or unofficial channels is FRAUDULENT. 
                  Report suspicious activity immediately to our official numbers.
                </span>
              </p>
            </div>
            <p className="text-xs text-center text-gray-500">
              © {new Date().getFullYear()} AR Automation. All rights reserved. | Loans subject to eligibility and collateral assessment.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}