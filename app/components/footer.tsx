  // components/Footer.jsx
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full">
      {/* Main Footer */}
      <div style={{ backgroundColor: '#0B3C5D' }} className="text-[#E5E5E5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Column 1 - Business Information */}
            <div className="space-y-4">
              <h2 style={{ color: '#D4AF37' }} className="text-xl font-bold mb-4 border-b border-[#D4AF37] pb-2">
                XDt associate
              </h2>
              <p className="text-sm leading-relaxed">
                Fast, secure and trusted collateral-based loan services. We accept portable high-value items for quick financial assistance.
              </p>
              <div className="mt-4 text-sm">
                <p className="font-semibold text-[#D4AF37]">Working Hours:</p>
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 3:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>

            {/* Column 2 - Official Payment Details (IMPORTANT) */}
            <div className="space-y-4">
              <h2 style={{ color: '#D4AF37' }} className="text-xl font-bold mb-4 border-b border-[#D4AF37] pb-2">
                Official Payment Details
              </h2>
              
              {/* Bank Accounts */}
              <div className="mb-4">
                <p className="font-semibold text-[#D4AF37] mb-2">🏦 Bank Accounts:</p>
                <ul className="text-sm space-y-1">
                  <li>National Bank Robert Mwase 1008203098</li>
                  <li>FDH Bank  Robert Mwase 140000628157</li>
                  <li>First Capital Bank  Robert Mwase 0004503119692</li>
                  <li>Standard Bank Robert Mwase  9100008634197</li>
                </ul>
              </div>

              {/* Mobile Money */}
              <div className="mb-4">
                <p className="font-semibold text-[#D4AF37] mb-2"> Mobile Money:</p>
                <ul className="text-sm space-y-1">
                  <li>Airtel Money Agent Code  885584</li>
                  <li>Airtel Money Dealer  0998843651 / 0983170685</li>
                  <li>TNM Mpamba Agent Code  140547 / 2001542</li>
                </ul>
              </div>

              {/* Red Warning Message */}
              <div style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }} className="p-3 rounded-md border-l-4 border-[#FF4D4D]">
                <p style={{ color: '#FF4D4D' }} className="text-sm font-bold">
                  ⚠️ Any payment details not listed above are NOT legit.
                </p>
              </div>
            </div>

            {/* Column 3 - Accepted Collaterals */}
            <div className="space-y-4">
              <h2 style={{ color: '#D4AF37' }} className="text-xl font-bold mb-4 border-b border-[#D4AF37] pb-2">
                Accepted Collaterals
              </h2>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-semibold text-[#D4AF37] mb-1">Electronics:</p>
                  <ul className="space-y-1">
                    <li>• Laptops</li>
                    <li>• Smartphones</li>
                    <li>• Cameras</li>
                    <li>• Smartwatches</li>
                    <li>• Projectors</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-[#D4AF37] mb-1">Appliances:</p>
                  <ul className="space-y-1">
                    <li>• Microwaves</li>
                    <li>• Electric Irons</li>
                    <li>• Electric Kettles</li>
                  </ul>
                </div>
              </div>
              
              <Link 
                href="/accepted-collaterals" 
                className="inline-block mt-2 text-[#D4AF37] hover:text-white transition-colors text-sm font-semibold"
              >
                 View Full List →
              </Link>
            </div>

            {/* Column 4 - Contact Information */}
            <div className="space-y-4">
              <h2 style={{ color: '#D4AF37' }} className="text-xl font-bold mb-4 border-b border-[#D4AF37] pb-2">
                Contact Us
              </h2>
              
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold text-[#D4AF37]">Phone:</span><br />
                  +265 999 000 000<br />
                  +265 888 000 000
                </p>
                <p>
                  <span className="font-semibold text-[#D4AF37]"> WhatsApp:</span><br />
                  +265 999 000 000
                </p>
                <p>
                  <span className="font-semibold text-[#D4AF37]">Email:</span><br />
                  info@arautomation.mw<br />
                  support@arautomation.mw
                </p>
                <p>
                  <span className="font-semibold text-[#D4AF37]"> Location:</span><br />
                  mchesi,karonga<br />
                  Malawi
                </p>
              </div>

              {/* Apply for Loan Button */}
              <Link
                href="/admin/login"
                style={{ backgroundColor: '#D4AF37' }}
                className="inline-block px-6 py-3 text-[#0A1F44] font-bold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105 text-center w-full sm:w-auto"
              >
                 Apply for Loan
              </Link>
            </div>
          </div>

          {/* Small divider line */}
          <div className="border-t border-[#D4AF37] opacity-30 my-8"></div>

          {/* Additional Info Row */}
          <div className="text-sm text-center text-[#E5E5E5] opacity-75">
            <p>All transactions are secure and encrypted. We value your trust.</p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div style={{ backgroundColor: '#06142B' }} className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} XDt. All Rights Reserved.
            </div>

            {/* Fraud Warning */}
            <div className="text-sm text-center md:text-right">
              <span style={{ color: '#FF4D4D' }} className="font-bold">
                ⚠️ Fraud Warning:
              </span>
              <span className="text-gray-400 ml-2">
                Only use official payment details listed on this website. Always send payment screenshot after transaction.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;