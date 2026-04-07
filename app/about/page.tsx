'use client';
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheckIcon, 
  HeartIcon, 
  BoltIcon, 
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  CheckBadgeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const values = [
    {
      icon: ShieldCheckIcon,
      title: "Transparency",
      description: "No hidden fees, clear terms, and honest communication every step of the way."
    },
    {
      icon: HeartIcon,
      title: "Customer Focus",
      description: "Your financial needs are our priority. We're here to help, not complicate."
    },
    {
      icon: BoltIcon,
      title: "Fast Service",
      description: "Quick approvals and same-day disbursements when you need funds urgently."
    },
    {
      icon: UserGroupIcon,
      title: "Integrity",
      description: "We uphold the highest ethical standards in all our dealings."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Apply Online",
      description: "Fill out our simple application form with your details and loan requirements."
    },
    {
      number: "02",
      title: "Quick Approval",
      description: "We review your application and collateral information within hours."
    },
    {
      number: "03",
      title: "Receive Funds",
      description: "Once approved, funds are disbursed directly to your mobile money or bank account."
    },
    {
      number: "04",
      title: "Flexible Repayment",
      description: "Repay in convenient installments according to your agreed terms."
    }
  ];

  const whyChooseUs = [
    "Registered and regulated financial service provider in Malawi",
    "No hidden fees or surprise charges",
    "Quick approval process - get funds within 24 hours",
    "Secure handling of your personal and financial data",
    "Flexible loan terms tailored to your needs",
    "Physical office in Lilongwe for face-to-face support"
  ];

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden group">
        <Image
          src="/about2.jpeg"
          alt="XDT Hero"
          fill
          className="object-cover transition-all duration-1000 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-700"></div>
        
        <div className="relative text-center px-6 max-w-4xl transform transition-all duration-700 group-hover:translate-y-[-10px] group-hover:scale-105">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg transition-all duration-700 group-hover:translate-x-2">
            About XDT
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-md max-w-3xl mx-auto transition-all duration-700 delay-100 group-hover:translate-x-[-5px]">
            Your Trusted Financial Partner in Lilongwe, Malawi
          </p>
          <div className="w-20 h-0.5 bg-white mx-auto mt-6 transition-all duration-700 delay-200 group-hover:w-32"></div>
        </div>
      </section>

      {/* INTRODUCTION SECTION */}
      <section className="py-16 bg-white group/section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="transform transition-all duration-700 group-hover/section:translate-x-[-15px]">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 transition-all duration-700 group-hover/section:translate-y-[-5px]">
                Who We Are
              </h2>
              <div className="w-16 h-0.5 bg-gray-300 mb-5 transition-all duration-700 group-hover/section:w-24"></div>
              <p className="text-base text-gray-700 leading-relaxed text-justify mb-4 transition-all duration-700 delay-100 group-hover/section:translate-x-1">
                XDT is a leading loan and money lending company based in Lilongwe, Malawi. 
                Founded by <span className="font-semibold text-gray-900">Robert Mwase</span>, we provide fast personal loans 
                and small business loans to individuals who need quick financial assistance.
              </p>
              <p className="text-base text-gray-700 leading-relaxed text-justify mb-4 transition-all duration-700 delay-200 group-hover/section:translate-x-1">
                We understand that financial emergencies can happen at any time. That's why we've 
                created a simple, transparent process that helps you access the funds you need 
                using your valuable items as collateral.
              </p>
              <p className="text-base text-gray-700 leading-relaxed text-justify transition-all duration-700 delay-300 group-hover/section:translate-x-1">
                Our team is dedicated to providing professional, respectful, and efficient service 
                to every customer who walks through our doors or visits our website.
              </p>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-md group/image">
              <Image
                src="/money.jpeg"
                alt="About XDT"
                fill
                className="object-cover transition-all duration-1000 group-hover/image:scale-110 group-hover/image:rotate-1"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-16 bg-gray-50 group/section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10 transform transition-all duration-700 group-hover/section:translate-y-[-5px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Purpose</h2>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto transition-all duration-700 group-hover/section:w-24"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all group/card transform transition-all duration-700 hover:scale-105 hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-all duration-700 group-hover/card:translate-x-2">Our Mission</h3>
              <div className="w-12 h-0.5 bg-gray-300 mb-4 transition-all duration-700 group-hover/card:w-20"></div>
              <p className="text-base text-gray-600 leading-relaxed text-justify transition-all duration-700 delay-100 group-hover/card:translate-x-1">
                To provide accessible, transparent, and reliable financial support to individuals 
                and small businesses in Malawi, helping them overcome temporary financial challenges 
                and achieve their goals with dignity and respect.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all group/card transform transition-all duration-700 hover:scale-105 hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-all duration-700 group-hover/card:translate-x-2">Our Vision</h3>
              <div className="w-12 h-0.5 bg-gray-300 mb-4 transition-all duration-700 group-hover/card:w-20"></div>
              <p className="text-base text-gray-600 leading-relaxed text-justify transition-all duration-700 delay-100 group-hover/card:translate-x-1">
                To become Malawi's most trusted lending partner, recognized for our integrity, 
                customer-centric approach, and commitment to financial inclusion for all Malawians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LICENSES SECTION */}
      <section className="py-16 bg-white group/section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 transform transition-all duration-700 group-hover/section:translate-x-[-10px]">
              <div className="flex items-center gap-3 mb-4">
                <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Our Licenses</h2>
              </div>
              <div className="w-16 h-0.5 bg-blue-600 mb-5 transition-all duration-700 group-hover/section:w-24"></div>
              <p className="text-base text-gray-700 leading-relaxed text-justify mb-4 transition-all duration-700 delay-100 group-hover/section:translate-x-1">
                XDT is fully licensed and regulated by the relevant financial authorities in Malawi. 
                We operate in strict compliance with all local laws and regulations governing 
                money lending and financial services.
              </p>
              <p className="text-base text-gray-700 leading-relaxed text-justify mb-4 transition-all duration-700 delay-200 group-hover/section:translate-x-1">
                Our license demonstrates our commitment to transparency, ethical lending practices, 
                and customer protection. We are proud to be a trusted financial partner in the community.
              </p>
              <div className="flex items-center gap-2 mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800 font-medium">Registered and compliant with Malawi financial regulations</p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg order-1 md:order-2 group/image">
              <Image
                src="/linceses.jpg"
                alt="XDT Licenses and Certifications"
                fill
                className="object-contain bg-gray-100 p-4 transition-all duration-1000 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/5 transition-all duration-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 bg-gray-50 group/section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 transform transition-all duration-700 group-hover/section:translate-y-[-5px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-4 transition-all duration-700 group-hover/section:w-24"></div>
            <p className="text-base text-gray-600 transition-all duration-700 group-hover/section:scale-105">
              Simple, fast, and transparent loan process
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group/step">
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm transition-all duration-700 group-hover/step:scale-105 group-hover/step:-translate-y-3 group-hover/step:shadow-xl group-hover/step:border-gray-300">
                  <span className="text-4xl font-black text-gray-200 mb-3 block transition-all duration-700 group-hover/step:text-gray-400 group-hover/step:scale-110 group-hover/step:translate-x-2">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 transition-all duration-700 group-hover/step:translate-x-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify transition-all duration-700 delay-100 group-hover/step:translate-x-1">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 transition-all duration-700 group-hover/step:translate-x-2">
                    <svg className="w-5 h-5 text-gray-300 group-hover/step:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY VALUES */}
      <section className="py-16 bg-white group/section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 transform transition-all duration-700 group-hover/section:translate-y-[-5px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Values</h2>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-4 transition-all duration-700 group-hover/section:w-24"></div>
            <p className="text-base text-gray-600 transition-all duration-700 group-hover/section:scale-105">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm text-center group/card transform transition-all duration-700 hover:scale-110 hover:-translate-y-3 hover:shadow-xl">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-700 group-hover/card:bg-gray-100 group-hover/card:scale-125 group-hover/card:rotate-12">
                  <value.icon className="w-6 h-6 text-gray-700 transition-all duration-700 group-hover/card:text-gray-900 group-hover/card:scale-110" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 transition-all duration-700 group-hover/card:translate-y-[-2px] group-hover/card:scale-105">{value.title}</h3>
                <p className="text-sm text-gray-600 text-justify transition-all duration-700 delay-100 group-hover/card:translate-x-1">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-gray-50 group/section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[350px] rounded-xl overflow-hidden shadow-md order-2 md:order-1 group/image">
              <Image
                src="/about.jpg"
                alt="Why Choose XDT"
                fill
                className="object-cover transition-all duration-1000 group-hover/image:scale-110 group-hover/image:-rotate-1"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-all duration-700"></div>
            </div>
            <div className="order-1 md:order-2 transform transition-all duration-700 group-hover/section:translate-x-[-10px]">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 transition-all duration-700 group-hover/section:translate-y-[-5px]">Why Choose XDT</h2>
              <div className="w-16 h-0.5 bg-gray-300 mb-5 transition-all duration-700 group-hover/section:w-24"></div>
              <ul className="space-y-3">
                {whyChooseUs.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 group/item transition-all duration-700 hover:translate-x-3 hover:scale-[1.02]">
                    <CheckBadgeIcon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5 transition-all duration-700 group-hover/item:text-gray-700 group-hover/item:rotate-12 group-hover/item:scale-125" />
                    <span className="text-sm text-gray-700 text-justify transition-all duration-700 group-hover/item:text-gray-900">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* REGULATORY COMPLIANCE */}
      <section className="py-12 bg-white group/section">
        <div className="max-w-4xl mx-auto px-6 text-center transform transition-all duration-700 group-hover/section:scale-105">
          <ShieldCheckIcon className="w-12 h-12 mx-auto mb-4 text-gray-700 transition-all duration-700 group-hover/section:rotate-12 group-hover/section:scale-125" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3 transition-all duration-700 group-hover/section:translate-y-[-3px]">Licensed & Regulated</h2>
          <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-4 transition-all duration-700 group-hover/section:w-32"></div>
          <p className="text-sm text-gray-600 leading-relaxed text-justify max-w-3xl mx-auto transition-all duration-700 delay-100 group-hover/section:translate-y-1">
            XDT operates in full compliance with Malawi's financial regulations. 
            We follow all legal and regulatory guidelines to protect our customers 
            and ensure fair lending practices. Your data is secure, and your privacy 
            is our priority.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-16 bg-gray-50 group/section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 transform transition-all duration-700 group-hover/section:translate-y-[-5px]">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Visit Our Office</h2>
            <div className="w-16 h-0.5 bg-gray-300 mx-auto mb-4 transition-all duration-700 group-hover/section:w-24"></div>
            <p className="text-base text-gray-600 transition-all duration-700 group-hover/section:scale-105">
              We're located in the heart of Lilongwe. Visit us for face-to-face assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPinIcon, title: "Office Location", content: ["Area 18, Lilongwe", "Opposite Gateway Mall", "Malawi"] },
              { icon: PhoneIcon, title: "Phone", content: ["+265 888 123 456", "+265 999 123 456"] },
              { icon: EnvelopeIcon, title: "Email", content: ["info@xdt.mw", "support@xdt.mw"] }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white shadow-sm group/card transform transition-all duration-700 hover:scale-110 hover:-translate-y-4 hover:shadow-xl">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm transition-all duration-700 group-hover/card:scale-125 group-hover/card:rotate-12 group-hover/card:shadow-md">
                  <item.icon className="w-6 h-6 text-gray-700 transition-all duration-700 group-hover/card:rotate-12" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 transition-all duration-700 group-hover/card:translate-y-[-2px]">{item.title}</h3>
                {item.content.map((line, i) => (
                  <p key={i} className="text-sm text-gray-600 transition-all duration-700 delay-100 group-hover/card:translate-x-1">{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm group/hours transform transition-all duration-700 hover:scale-105 hover:-translate-y-1 hover:shadow-md">
              <ClockIcon className="w-4 h-4 text-gray-500 transition-all duration-700 group-hover/hours:rotate-12 group-hover/hours:scale-125" />
              <span className="text-sm text-gray-700 transition-all duration-700 group-hover/hours:translate-x-1">Mon-Fri: 8AM-5PM | Sat: 9AM-1PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 border-t border-gray-200 bg-white group/section">
        <div className="max-w-4xl mx-auto text-center px-6 transform transition-all duration-700 group-hover/section:scale-105">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 transition-all duration-700 group-hover/section:translate-y-[-5px]">Ready to Get Started?</h2>
          <p className="text-base mb-6 text-gray-600 transition-all duration-700 delay-100 group-hover/section:translate-y-[-2px]">
            Visit our office or apply online today. We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/client/home"
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-sm group/btn transform transition-all duration-700 hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:bg-gray-800"
            >
              <span className="transition-all duration-700 group-hover/btn:translate-x-1 inline-block">Apply Now</span>
            </Link>
            <Link 
              href="/contact"
              className="px-6 py-3 bg-white border border-gray-200 text-gray-900 font-semibold rounded-lg group/btn transform transition-all duration-700 hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:border-gray-400"
            >
              <span className="transition-all duration-700 group-hover/btn:translate-x-1 inline-block">Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}